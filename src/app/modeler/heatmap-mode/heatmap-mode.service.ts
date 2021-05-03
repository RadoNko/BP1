import {AfterViewInit, Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ElasticsearchService} from "./elasticsearch/elasticsearch.service";
import {TransitionData} from "./transition-data";
import {ModelService} from "../model.service";
import {BehaviorSubject, interval} from "rxjs";
import {Model} from "../classes/model";
import {Transition} from "../classes/transition";
import {CanvasService} from "../canvas.service";

@Injectable({
    providedIn: 'root'
})
export class HeatmapModeService implements AfterViewInit{

    private _originLogFile: string;
    private _transitionDataSet: Set<TransitionData>;
    private _originalModel: BehaviorSubject<Model>;
    private _min_val : number;
    private _max_val : number;


    constructor (private http: HttpClient, private es: ElasticsearchService,private modelService: ModelService,private canvasService: CanvasService) {
        this._transitionDataSet = new Set<TransitionData>();
        this._originalModel = new BehaviorSubject(new Model());
        this._min_val = Number.MAX_VALUE;
        this._max_val = Number.MIN_VALUE
    }


    get min_val (): number {
        return this._min_val;
    }

    set min_val (value: number) {
        this._min_val = value;
    }

    get max_val (): number {
        return this._max_val;
    }

    set max_val (value: number) {
        this._max_val = value;
    }

    get transitionDataSet (): Set<TransitionData> {
        return this._transitionDataSet;
    }

    set transitionDataSet (value: Set<TransitionData>) {
        this._transitionDataSet = value;
    }

    get originalModel (): BehaviorSubject<Model> {
        return this._originalModel;
    }

    set originalModel (value: BehaviorSubject<Model>) {
        this._originalModel = value;
    }

    get originLogFile (): string {
        return this._originLogFile;
    }

    set originLogFile (value: string) {
        this._originLogFile = value;
    }

    loadFile (file: File): string {
        const reader = new FileReader();
        reader.onload = () => {
            this.originLogFile = String(reader.result);
            //this.renderHeatMap();
            //console.log("READER ONLOAD => "+reader.result);
            let t = reader.result;
            const headers = {'content-type':'text/plain'};
            const body = {t};
            const options = {
                responseType : 'text',
            };

            this.http.get('http://localhost:9200/_aliases').subscribe({
                next : data =>{
                    let indexName = 'logstash-output-finished';
                    console.log("Index exists: "+data.hasOwnProperty(indexName));
                    if (data.hasOwnProperty(indexName)){
                        this.http.delete('http://localhost:9200/logstash-output-finished').subscribe({
                            next : data=>{
                                console.log("Index is being deleted");

                                this.http.put('http://localhost:9200/logstash-output-finished',null,{responseType : "text"}).subscribe({
                                    next : data =>{
                                        this.http.post('http://localhost:4201', reader.result, {responseType : "text"}).subscribe({
                                            next : data =>{
                                                console.log("Data sent to index.");

                                                this.writeDataState();
                                            },
                                            error : error =>{
                                                console.log("Failed to send data to index.");
                                            }
                                        })
                                        //
                                        /*

                                        this.http.post('http://localhost:4201', reader.result, {responseType : "text"}).subscribe({
                                            next : data =>{
                                                console.log("Sending data to index: "+data);
                                                //

                                                this.http.get('http://localhost:9200/logstash-output-finished/_field_caps?fields=*').subscribe({
                                                    next : data=>{
                                                        let isSearchable = data["fields"].hasOwnProperty('STATE');
                                                        let isSearchable2 = data["fields"]["_source"]["_source"].searchable;
                                                        console.log("Has own property STATE: "+isSearchable);
                                                        let counter = 1;
                                                        console.log("Testing if index is searchable{"+counter+"}");
                                                        this.http.get('http://localhost:9200/logstash-output-finished/_stats').subscribe({
                                                            next : data=> {
                                                                console.log("STATS:");
                                                                console.log(data);
                                                            },
                                                            error : error =>{
                                                                console.log(error);
                                                            }
                                                        })


                                                        if (isSearchable == false || isSearchable2 == false){
                                                            const retry = interval(1000).subscribe({
                                                                next : data=>{

                                                                    this.http.get('http://localhost:9200/logstash-output-finished/_field_caps?fields=*').subscribe({
                                                                        next : data => {
                                                                            counter++;
                                                                            console.log("Waiting for index to be searchable{"+counter+"}");
                                                                            isSearchable = data["fields"].hasOwnProperty('STATE');
                                                                            isSearchable2 = data["fields"]["_source"]["_source"].searchable;
                                                                            console.log("Has own  property STATE: "+isSearchable);
                                                                            console.log("_source is searchable: "+isSearchable2);
                                                                            if (isSearchable == true){
                                                                                console.log(data["fields"]);
                                                                                console.log("Fetching data");
                                                                                setTimeout(() => this.writeDataState(),5000);
                                                                                //this.writeDataState();
                                                                                retry.unsubscribe();
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                        else{
                                                            console.log("Fetching data");
                                                            this.writeDataState()
                                                        }
                                                    }
                                                })

                                                //
                                            }
                                        })

                                        */
                                        //
                                    }
                                })
                            }
                        })
                    }
                    else {
                        this.http.put('http://localhost:9200/logstash-output-finished',null,{responseType : "text"}).subscribe({
                            next : data =>{
                                this.http.post('http://localhost:4201', reader.result, {responseType : "text"}).subscribe({
                                    next : data =>{
                                        console.log("Data sent to index.");

                                        this.writeDataState();
                                    },
                                    error : error =>{
                                        console.log("Failed to send data to index.");
                                    }
                                })
                            }
                        })
                    }
                }
            })
        };

        reader.readAsText(file);
        return this.originLogFile
    }
    writeDataState () {
        let successFlag = false;
        this.drawPallete();
        this._transitionDataSet = new Set<TransitionData>();
        this.es.getState('logstash-output-finished', 'type')
            .then(response => {
                try {
                    response.hits.hits.forEach(value => {
                        let transData = new TransitionData(value._source.TASK, value._source.STATE, value._source.TIMESTAMP);
                        this._transitionDataSet.add(transData);
                    })
                    successFlag = true;
                }
                catch (e) {
                    if (e instanceof TypeError){
                        setTimeout(() => this.writeDataState(),1000);
                    }
                    else console.log(e);

                }

            }, error => {
                console.error(error);
            }).then(() => {
                if (successFlag){
                    this._transitionDataSet.forEach(value => {
                        console.log(value.toString());
                    })
                    this.renderHeatMap();
                    console.log('All data written!');
                }

        });


    }
    modelClone() {
        if (this.modelService.model === undefined) {
            this._originalModel.next(new Model());
            this.modelService.model = this._originalModel.getValue().clone();
        } else {
            this._originalModel.next(this.modelService.model);
            this.modelService.model = this._originalModel.getValue().clone();
        }
    }

    modelOnDestroy() {
        this.modelService.model = this._originalModel.getValue();
    }
    renderHeatMap(){
        //this.writeDataState();
        let canvasTransitions = this.modelService.model.transitions;
        this.setHeatFlag(true);

        this.calculateHeatMinMax(canvasTransitions);
        this.assignHeatLevelClass(canvasTransitions);

        console.log("Max_val: "+this._max_val+" Min_val: "+this._min_val);
    }
    setHeatFlag(value : boolean) : void {
        this.modelService.model.transitions.forEach(transition =>{
            transition.heatMapFlag = value;
        })
    }
    resetTransitionCount() : void {
        this.modelService.model.transitions.forEach(transition =>{
            transition.activationCount = 0;
        })
    }
    resetUniqueVariables() : void{
        this.setHeatFlag(false);
        this.resetTransitionCount();
    }
    /*
    calculateHeatLevel0(transition : Transition) : void{


        transition.objektyelementu.element.setAttributeNS(null, 'fill','blue');
        this._transitionDataSet.forEach(t =>{
            if (t.task == transition.label){
                transition.activationCount++;
            }
            if (transition.activationCount > this._max_val) this._max_val = transition.activationCount;
            if (transition.activationCount < this._min_val) this._min_val = transition.activationCount;

        })
        let total = this._transitionDataSet.size;
        console.log("Počet spustení: "+transition.activationCount);
        let ratio;


    }

     */
    calculateHeatMinMax(transition : Transition[]) : void{


        //transition.objektyelementu.element.setAttributeNS(null, 'fill','blue');
        this._transitionDataSet.forEach(t =>{
            transition.forEach(transition =>{
                if (t.task == transition.label){
                    transition.activationCount++;
                }
                if (transition.activationCount > this._max_val) this._max_val = transition.activationCount;
                if (transition.activationCount < this._min_val) this._min_val = transition.activationCount;
            })


        })
        transition.forEach(transition =>{
            console.log("Počet spustení{"+transition.label+"} :"+transition.activationCount);
        })
    }
    assignHeatLevelClass(transitions : Transition[]) : void {
        transitions.forEach(t =>{
            let level=Math.round(t.activationCount/this._max_val*11)-1;
            if (level < 0) level = 0;
            console.log("Level: "+level);
            t.objektyelementu.element.setAttributeNS(null,'class','svg-transition-heatmap-fill-'+level+' svg-inactive-stroke');
            //t.objektyelementu.element.addAttribute('class','svg-transition-heatmap-border');

        })
    }
    drawPallete(){
        let rect;
        let offset_x = 0;
        let offset_y = 0;
        for (let i = 0; i< 11 ; i++){
            rect = document.createElementNS(CanvasService.svgNamespace, 'rect') as HTMLElement;
            rect.setAttributeNS(null, 'x', String(offset_x + i * 30));
            rect.setAttributeNS(null, 'y', String(offset_y));
            rect.setAttributeNS(null, 'width', "30");
            rect.setAttributeNS(null, 'height', "30");
            rect.setAttributeNS(null, 'class','svg-transition-heatmap-fill-'+i);
            this.canvasService.canvas.add(rect);
        }
    }

    ngAfterViewInit (): void {
        //this.drawPallete();
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ElasticsearchService} from "./elasticsearch/elasticsearch.service";
import {TransitionData} from "./transition-data";

@Injectable({
    providedIn: 'root'
})
export class HeatmapModeService {

    private _originLogFile: string;
    //Struct holding Tasks [i][j] where i represents task number , j represents line
    private tasks: string [][];
    //Map holding task IDs by index in task array
    private taskID = new Map();
    private tasks$: Observable<string[]>;
    private elasticService: ElasticsearchService;
    private transitionDataSet: Set<TransitionData>;


    constructor (private http: HttpClient, private es: ElasticsearchService) {
        this.tasks = [];
        this.transitionDataSet = new Set<TransitionData>();
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
        };
        reader.readAsText(file);
        return this.originLogFile
    }

    /*
      renderHeatMap(){
        this.parseLog();
        //let len = this.task.length;
        let len = this.taskID.size;
        for (let i = 0; i < len;i++){
          //console.log(this.task[i]);
          //console.log(this.taskID.get(i));
        }
      }


      parseLog () {
        //console.log("OriginLogFile:"+this.originLogFile);
        let lines = this.originLogFile.split(/[\r\n]+/g);


        //Task Index
        let i: number = 0;
        //Line Index
        let j: number = 0;

        let startOfTask: boolean = false;
        let endOfTask: boolean = false;

        //Array Containing single task
        let taskArray: string [] = new Array();

        this.tasks$ = new Observable(subscriber => {


          lines.forEach((line) => {
            if (startOfTask) {
              taskArray.push(line);
              //console.log(line);
              //End of task is marked by substr "was finished"
              if (line.includes("was finished")) {
                endOfTask = true;
                startOfTask = !startOfTask;
              }
            }

            //Start of task is marked "uri=/api/task/[id]]/data;"
            if (line.includes("uri=/api/task") && line.includes("data") && !startOfTask) {
              taskArray.push(line);
              let sublines = line.split('/');
              this.taskID.set(i++, sublines[3]);
              startOfTask = true;
            }

            if (endOfTask) {
              //if (testBool) console.log("--------------- END OF TASK ---------------");
              //Push entire task to Array of Tasks
              this.tasks.push(taskArray);
              subscriber.next(taskArray);
              //reset taskArray
              taskArray = [];

              //reverse endOfTask bool
              endOfTask = !endOfTask;

            }
            //Each iteration increases Line index
            //j++;
          });
        });

      }*/
    writeDataState () {
        this.es.getState('logstash-output-finished', 'type')
            .then(response => {
                response.hits.hits.forEach(value => {
                    let transData = new TransitionData(value._source.TASK, value._source.STATE, value._source.TIMESTAMP);
                    this.transitionDataSet.add(transData);
                })
            }, error => {
                console.error(error);
            }).then(() => {
            this.transitionDataSet.forEach(function (value) {
                console.log(value.toString());
            })
            console.log('All data written!');
        });


    }


}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ElasticsearchService } from '../elasticsearch.service';

@Component({
  selector: 'nab-test-elastic-connection',
  templateUrl: './test-elastic-connection.component.html',
  styleUrls: ['./test-elastic-connection.component.scss']
})
export class TestElasticConnectionComponent implements OnInit {
  isConnected = false;
  status: string;
  constructor(private es: ElasticsearchService, private cd: ChangeDetectorRef) {
    this.isConnected = false;

  }

  ngOnInit(){
    this.es.isAvailable().then(() => {
      this.status = 'OK';
      this.isConnected = true;
      console.log("Server status:"+this.status);
    }, error => {
      this.status = 'ERROR';
      this.isConnected = false;
      console.error('Server is down', error);
      console.log("Server status:"+this.status);
    }).then(() => {
      this.cd.detectChanges();
    });
  }

}

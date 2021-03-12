import { Injectable } from '@angular/core';
import {Client} from "elasticsearch-browser";
import * as elasticsearch from 'elasticsearch-browser';

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {
  private client: Client;
  private queryalldocs = {
    'query': {
      "match": {
        "STATE": "finished"
      }
    }
  };

  constructor() {
    if (!this.client) {
      this._connect();
    }
  }
  private connect() {
    this.client = new Client({
      host: 'http://localhost:9200',
      log: 'trace'
    });
  }
  private _connect() {
    this.client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'trace'
    });
  }
  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'hello ozenero!'
    });
  }
  getState(_index, _type): any {
    return this.client.search({
      index: _index,
      body: this.queryalldocs,
      filterPath: ['hits.hits._source'],
      _source: ["TASK","STATE","TIMESTAMP"]
    });
  }
}

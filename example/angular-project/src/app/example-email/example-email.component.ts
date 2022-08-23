import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

let JSONHeader = new HttpHeaders();
JSONHeader = JSONHeader.append('content-type', 'application/json');

@Component({
  selector: 'app-example-email',
  templateUrl: './example-email.component.html',
  styleUrls: ['./example-email.component.css']
})
export class ExampleEmailComponent implements OnInit {
  items: any[] = [];
  displayedColumns = ['name', 'price'];

  constructor(private httpClient: HttpClient, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // Get the id parameter
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    // Get the data from the server
    this.httpClient.post('http://localhost:4000/get-data', {id}, {headers: JSONHeader}).subscribe((response) => {
      // @ts-ignore
      this.items = response.items;
    })
  }

}

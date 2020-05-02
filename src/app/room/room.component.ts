import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
	name: string;
	username: string = "";
	messages: any = [];
	connected: boolean = false;
	message: string = "";

	socket: any;
  WSURL = 'ws://127.0.0.1:8000/ws/chat/';
  API_URL = 'http://127.0.0.1:8000/chat/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  setsocket() {
    this.socket = new WebSocket(this.WSURL+this.name+'/');
    // console.log(this.socket);
    this.socket.onopen = () => {
      console.log("Websockets connection created!");
      this.connected = true;
    }
    // what will happen on message!
    this.socket.onmessage = (event) => {
      //console.log(event);
      this.handleMessage(event);
    }

    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.onopen(null);
    }
  }

  constructor(private route: ActivatedRoute,
  			private http: HttpClient) { }

  ngOnInit(): void {
  	this.name = this.route.snapshot.paramMap.get('roomId');
  }

  handleMessage(event) {
  	let eventData = JSON.parse(event['data']);
  	let messageData = JSON.parse(eventData.message);
  	this.messages.push(messageData);
  }

  connect() {
  	this.setsocket();
  }

  sendMessage(){
  	let url = this.API_URL + 'rooms/' + this.name + '/user/' + this.username + '/';
  	let message = {
  		'message': this.message
  	}
  	this.http.post(url, message, this.httpOptions).subscribe(response => {
  		console.log(response);
  	})

  }

}

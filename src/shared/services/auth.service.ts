import { Injectable, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import * as hello from 'hellojs/dist/hello.all.js';
import { Configs } from '../configs/config';

@Injectable()
export class AuthService {

  public tokenReceived: EventEmitter<any> = new EventEmitter();
  constructor() { }

  initAuth() {
    hello.init({
        msft: {
          id: Configs.appId,
          oauth: {
            version: 2,
            auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            grant: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
          },
          scope_delim: ' ',
          form: false
        }
      }, {
        redirect_uri : 'http://localhost:8100/',
        oauth_proxy: 'https://auth-server.herokuapp.com/proxy'
      }
    );
  }

  async login(noDisplay) {
    let json:any = { scope: Configs.scope, response_type: 'code', force: true };
    if(noDisplay) json.display = 'none';
    return await hello('msft').login(json);
  }

  logout() {
    hello('msft').logout().then(
      () => {
        return;
      },
      e => { console.error(e.error.message)}
    );
  }

  getAuthRequestOptions() {
    const msft = hello('msft').getAuthResponse();
    const authHeaders = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + msft.access_token });
    return { headers: authHeaders };
  }

  emitToken() {
    this.tokenReceived.emit();
  }
}

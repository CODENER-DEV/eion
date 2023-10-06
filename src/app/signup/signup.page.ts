import { Component, OnInit } from '@angular/core';
declare var axios: any;
import { config } from '../../settings/config';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { NotificationsService } from '../services/notifications.service';
// @ts-ignore
import * as bcrypt from 'bcryptjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  showSpinner = false;
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  rDate: string = '';
  formLS: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private storage: Storage,
    private ns: NotificationsService,
    public formBuilder: FormBuilder
  ) { }

  /**
   * ngOnInit (Lifecycle event) - register fiels to validate
   * @returns {Object} controls of form
   */
  ngOnInit() {
    this.formLS = this.formBuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required]],
      rDate: ['', [Validators.required]]
    });
  }

  /**
   * errorControl - get controls
   * @returns {Object} controls of form
   */
  get errorControl(){
    return this.formLS.controls;
  }

  ionViewWillEnter(){
    this.getRandomUser();
  }

  /**
   * getRandomUser communicates with API Random User with Async promise - get random user data and then autocomplete fields
   * @returns {Object} movies
   */
  getRandomUser(){
    axios.get(config.urlRandomUser, {
      headers: {
          'Content-Type': 'application/json'
      }
    }).then((res: any) => {
        console.log(res);
        if(res.status == 200){
          this.name = res.data.results[0].name.title + ' ' + res.data.results[0].name.first + ' ' + res.data.results[0].name.last;
          this.username = res.data.results[0].login.username;
          this.email = res.data.results[0].email;
          this.rDate = res.data.results[0].registered.date;
          this.showSpinner = false;
        }
    }).catch(async (error: any) => {
      console.log(error);
      await this.ns.sendLocalNotification(error.response.data.error);
      this.showSpinner = false;
    });
  }

  /**
   * signUp - save data user in Storage, with encrypted password
   * @returns {Object} show Local notificaction if there is success or error and redirect to login
   */
  async signUp(){
    this.showSpinner = true;
    if(this.formLS.valid){
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(this.password, salt);

      await this.storage.set('userMV', JSON.stringify({
        name: this.name,
        username: this.username,
        email: this.email,
        password: hash,
        rDate: this.rDate
      }));
      this.showSpinner = false;
      await this.ns.sendLocalNotification('Successful signup');
      this.router.navigate(['/login'], {replaceUrl: true});
    }
    else{
      await this.ns.sendLocalNotification('Fill out all fields please');
      this.showSpinner = false;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { NotificationsService } from '../services/notifications.service';
// @ts-ignore
import * as bcrypt from 'bcryptjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showSpinner = false;
  email: string = '';
  password: string = '';
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
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * errorControl - get controls
   * @returns {Object} controls of form
   */
  get errorControl(){
    return this.formLS.controls;
  }

  /**
   * logIn - compare email and encrypted password getted in Storage to validate user
   * @returns {Object} show Local notificaction if there is success or error
   */
  async logIn(){
    this.showSpinner = true;
    if(this.formLS.valid){
      let user = await this.storage.get('userMV');
      user = JSON.parse(user);
      console.log(user);
      if(user){
        const compareHash = bcrypt.compareSync(this.password, user.password); 
        if(user.email == this.email && compareHash){
          await this.ns.sendLocalNotification('Successful login');
          this.router.navigate(['/home'], {replaceUrl: true});
        }
        else{
          await this.ns.sendLocalNotification('The email or password is incorrect, try another one');
          this.showSpinner = false;
        }
      }
      else{
        await this.ns.sendLocalNotification('The user does not exist, try another one or register');
        this.showSpinner = false;
      }
    }
    else{
      await this.ns.sendLocalNotification('Fill out all fields please');
      this.showSpinner = false;
    }
  }

}

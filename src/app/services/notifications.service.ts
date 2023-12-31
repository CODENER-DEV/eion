import { Injectable } from '@angular/core';
import { LocalNotifications} from '@awesome-cordova-plugins/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private localNotifications: LocalNotifications
  ) { }

  /**
   * sendLocalNotification - send local notifications for each action
   * @param {Object} text - message of notification
   * @returns {Object} notification
   */
  async sendLocalNotification(text: string){
    await this.localNotifications.schedule({
      id: Math.floor((Math.random() * 100) + 1),
      title: 'Movies TVMAZE',
      text: text,
      foreground: true,
      priority: 2,
      lockscreen: true,
      vibrate: true
    });
  }
}

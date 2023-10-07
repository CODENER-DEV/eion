import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      console.log('device ready');
    });
  }

  async ngOnInit() {
    await this.storage.create();
  }
}

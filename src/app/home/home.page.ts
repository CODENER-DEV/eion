import { Component, ViewChild } from '@angular/core';
import { ToastController, AlertController, IonInfiniteScroll } from '@ionic/angular';
declare var axios: any;
import { config } from '../../settings/config';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  showSpinner = false;
  movies: any = [];
  query: string = '';
  isModalOpen = false;
  movieDetail: any = [];
  sl: number = 0;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private storage: Storage
  ) {}

  ngOnInit() {}

  /**
   * ionViewWillEnter (Lifecycle event) - verify user saved in Storage if is valid
   * @returns {Object} show movies if is valid user, else redirect to login if is invalid
   */
  async ionViewWillEnter(){
    let user = await this.storage.get(config.valueStorage);
    user = JSON.parse(user);
    console.log(user);
    if(!user){
      this.router.navigate(['/login'], {replaceUrl: true});
    }
    this.getMovies();
  }

  /**
   * loadMoreMovies - get movies with infinite scroll 12 by 12
   * @returns {Object} movies
   */
  loadMoreMovies(){
    setTimeout(() => {
      this.sl += 12;
      this.infiniteScroll.complete();
      if(this.sl >= this.movies.length){
        this.infiniteScroll.disabled = true;
      }
    }, 500);
  }

  /**
   * getMovies communicates with API Movies TVMAZE with Async promise - get all movies
   * @returns {Object} movies
   */
  getMovies(){
    this.sl = 12;
    this.infiniteScroll.disabled = false;
    this.showSpinner = true;
    axios.get(config.urlFullSchedule, {
      headers: {
          'Content-Type': 'application/json'
      }
    }).then((res: any) => {
        console.log(res);
        if(res.status == 200){
          this.movies = [...res.data];
          this.showSpinner = false;
        }
    }).catch((error: any) => {
      console.log(error);
      this.toastController.create({
        message: error.message,
        position: 'bottom',
        duration: 4000,
        color: 'dark',
      }).then((toast) => {
        toast.present();
      });
      this.showSpinner = false;
    });
  }

  /**
   * getMoviesByFilter communicates with API Movies TVMAZE with Async promise - get all movies with filter
   * @returns {Object} movies
   */
  getMoviesByFilter(){
    if(this.query == ''){
      this.getMovies();
    }
    else{
      this.sl = 12;
      this.infiniteScroll.disabled = false;
      this.showSpinner = true;
      axios.get(config.urlShowSingleSearch + this.query, {
        headers: {
            'Content-Type': 'application/json'
        }
      }).then((res: any) => {
          console.log(res);
          if(res.status == 200){
            this.movies = [...res.data];
            this.showSpinner = false;
          }
      }).catch((error: any) => {
        console.log(error);
        this.toastController.create({
          message: error.message,
          position: 'bottom',
          duration: 4000,
          color: 'dark',
        }).then((toast) => {
          toast.present();
        });
        this.showSpinner = false;
      });
    }
  }

  /**
   * openDetailMovie - show modal for view detail movie
   * @param {Object} movie  - movie data to view detail
   */
  openDetailMovie(movie: any){
    this.movieDetail = movie;
    this.isModalOpen = true;
  }

  /**
   * logOut - log out session user
   * @returns {Object} redirect to login
   */
  async logOut(){
    const alert = await this.alertController.create({
      header: 'Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            console.log('Alert confirmed');
            this.router.navigate(['/login'], {replaceUrl: true});
          },
        },
      ],
    });

    await alert.present();
  }

}

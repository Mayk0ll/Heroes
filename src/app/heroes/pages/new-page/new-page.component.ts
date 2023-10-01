import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', {nonNullable: true}),
    publisher: new FormControl<Publisher>(Publisher.MarvelComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  });

  public publishers = [
    {id: 'DC Comics', desc: 'DC- Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ]

  constructor(
    private heroesServices:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  get currentHero(): Hero {
      const hero = this.heroForm.value as Hero;
      return hero
  }

  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.heroesServices.getHeroById(id))
    ).subscribe( hero => {
      if( !hero ) return this.router.navigateByUrl('/');
      return this.heroForm.reset(hero)
    });
  }

  onSubmit():void{
    if(this.heroForm.invalid) return
    if(this.currentHero.id){
        this.heroesServices.updateHero(this.currentHero).subscribe( hero => {
          console.log(hero)
          this.showSnackbar(`${hero.superhero} Update`);
      });
      return
    }
    this.heroesServices.addHero(this.currentHero).subscribe( hero => {
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${hero.superhero} Created`);
    })
  }

  onDeleteHero(){
    if(!this.currentHero) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   if(!result) return;

    //   this.heroesServices.deleteHero(this.currentHero).subscribe( del => {
    //     if(del) this.router.navigate(['/heroes/list']);
    //   });
    // });

    dialogRef.afterClosed().pipe(
      filter( (res:boolean) => res),
      switchMap(() => this.heroesServices.deleteHero(this.currentHero)),
      filter( (res:boolean) => res),
    ).subscribe(() => this.router.navigate(['/heroes/list']))
  }

  showSnackbar(message: string):void{
    this.snackbar.open(message, 'done', {duration: 2500});
  }


}


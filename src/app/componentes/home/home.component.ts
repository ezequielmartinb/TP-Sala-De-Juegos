import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent 
{
  username: string | null = null;

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() 
  {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || null;
    });
  }
  
}

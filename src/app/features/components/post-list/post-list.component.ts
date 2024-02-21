import { Component } from '@angular/core';
import { Post } from '../../../shared/interfaces/post.interface';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent {
  // faire value object ?
  postInput: Post[] = [
    {
      id: 1,
      title: 'L’injection de dépendance dans Angular',
      resum:
        'Le Lorem Ipsum est le faux texte. Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression ...',
      content:
        'Le Lorem Ipsum est le faux texte. Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte ...',
      coverImagePath: 'assets/img/post_1/coverImg/LinkedIn DI - 1.png',
      keywords: [
        'Angular',
        'TypeScript',
        'Java',
        'Injection de dépendance',
        'TypeScript',
        'Java',
      ],
      readTime: 1,
      date: new Date(),
    },
    {
      id: 2,
      title: 'Titre 2',
      resum: 'resum',
      content: 'Content ',
      coverImagePath: 'truc',
      keywords: 'test',
      readTime: 1,
      date: new Date(),
    },
  ];
}

import { TestBed } from '@angular/core/testing';

import { TodolistService } from './todolist.service';

describe('TodolistService', () => {
  let service: TodolistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodolistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

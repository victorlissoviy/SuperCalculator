import { TestBed } from '@angular/core/testing';

import { GraphApi } from './graph-api';

describe('GraphApi', () => {
  let service: GraphApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

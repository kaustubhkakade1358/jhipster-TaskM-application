import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobHistory, NewJobHistory } from '../job-history.model';

export type PartialUpdateJobHistory = Partial<IJobHistory> & Pick<IJobHistory, 'id'>;

export type EntityResponseType = HttpResponse<IJobHistory>;
export type EntityArrayResponseType = HttpResponse<IJobHistory[]>;

@Injectable({ providedIn: 'root' })
export class JobHistoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-histories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(jobHistory: NewJobHistory): Observable<EntityResponseType> {
    return this.http.post<IJobHistory>(this.resourceUrl, jobHistory, { observe: 'response' });
  }

  update(jobHistory: IJobHistory): Observable<EntityResponseType> {
    return this.http.put<IJobHistory>(`${this.resourceUrl}/${this.getJobHistoryIdentifier(jobHistory)}`, jobHistory, {
      observe: 'response',
    });
  }

  partialUpdate(jobHistory: PartialUpdateJobHistory): Observable<EntityResponseType> {
    return this.http.patch<IJobHistory>(`${this.resourceUrl}/${this.getJobHistoryIdentifier(jobHistory)}`, jobHistory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJobHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJobHistory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJobHistoryIdentifier(jobHistory: Pick<IJobHistory, 'id'>): number {
    return jobHistory.id;
  }

  compareJobHistory(o1: Pick<IJobHistory, 'id'> | null, o2: Pick<IJobHistory, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobHistoryIdentifier(o1) === this.getJobHistoryIdentifier(o2) : o1 === o2;
  }

  addJobHistoryToCollectionIfMissing<Type extends Pick<IJobHistory, 'id'>>(
    jobHistoryCollection: Type[],
    ...jobHistoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobHistories: Type[] = jobHistoriesToCheck.filter(isPresent);
    if (jobHistories.length > 0) {
      const jobHistoryCollectionIdentifiers = jobHistoryCollection.map(jobHistoryItem => this.getJobHistoryIdentifier(jobHistoryItem)!);
      const jobHistoriesToAdd = jobHistories.filter(jobHistoryItem => {
        const jobHistoryIdentifier = this.getJobHistoryIdentifier(jobHistoryItem);
        if (jobHistoryCollectionIdentifiers.includes(jobHistoryIdentifier)) {
          return false;
        }
        jobHistoryCollectionIdentifiers.push(jobHistoryIdentifier);
        return true;
      });
      return [...jobHistoriesToAdd, ...jobHistoryCollection];
    }
    return jobHistoryCollection;
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { ContactEndpoint } from '@interfaces/contact.enum';
import { ListContactMessagesPayload } from '@payloads/list-contact-messages.interface';
import { ListContactMessagesResponse } from '@responses/list-contact-messages.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private readonly apiService: ApiService) {}

  listMessages(
    params: ListContactMessagesPayload
  ): Observable<ListContactMessagesResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.CONTACT,
      action: ContactEndpoint.LIST,
      params
    });
  }

  markAsRead(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.CONTACT,
      action: ContactEndpoint.MARK_READ,
      params: { id }
    });
  }

  markAsUnread(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.CONTACT,
      action: ContactEndpoint.MARK_UNREAD,
      params: { id }
    });
  }

  deleteMessage(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.CONTACT,
      action: ContactEndpoint.DELETE,
      params: { id }
    });
  }
}

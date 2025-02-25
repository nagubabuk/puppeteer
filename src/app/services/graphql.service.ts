import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) { }

  getInvoiceDetails() {
    return this.apollo.query({
      query: gql`
        query {
          getInvoiceDetails {
            customerName
            invoiceNumber
            items {
              name
              price
            }
          }
        }
      `,
    });
  }

  // generatePDF(htmlContent: string) {
  //   return this.apollo.mutate({
  //     mutation: gql`
  //     mutation GeneratePDF($html: String!) {
  //       generatePDF(html: $html)
  //     }
  //   `,
  //     variables: { html: htmlContent },
  //   });
  // }

  // generatePdf(
  //   userId: string,
  //   startDate: string,
  //   endDate: string,
  //   includeTransactions: boolean = true
  // ): Observable<string> {
  //   return this.apollo.query<{ generateAccountStatement: string }>({
  //     query: GENERATE_PDF_QUERY,
  //     variables: {
  //       userId,
  //       startDate,
  //       endDate,
  //       includeTransactions
  //     }
  //   }).pipe(
  //     map(result => result.data.generateAccountStatement)
  //   );
  // }
}

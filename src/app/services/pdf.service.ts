import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const GENERATE_PDF_QUERY = gql`
  query GenerateAccountStatement(
    $userId: String!
    $startDate: String!
    $endDate: String!
    $includeTransactions: Boolean
  ) {
    generateAccountStatement(
      userId: $userId
      startDate: $startDate
      endDate: $endDate
      includeTransactions: $includeTransactions
    )
  }
`;

const SEND_COMPLEX_DATA = gql`
 mutation SendComplexData($data: ComplexDataInput!) {
  sendComplexData(data: $data)
}
`;
@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private apollo: Apollo) { }

  generatePdf(
    userId: string,
    startDate: string,
    endDate: string,
    includeTransactions: boolean = true
  ): Observable<string> {
    return this.apollo.query<{ generateAccountStatement: string }>({
      query: GENERATE_PDF_QUERY,
      variables: {
        userId,
        startDate,
        endDate,
        includeTransactions
      }
    }).pipe(
      map(result => result.data.generateAccountStatement)
    );
  }


  sendData() {
    // Create dynamic data structure
    const complexData = {
      options: { returnPdf: true, withTableContent: true },
      screenshotUrls: { url: 'pres' },
      sessionData: { gdt: { errors: { erroutApp: false, data: 'hello failed' } } },
      windowData: { height: 340, width: 543 },
      windowSize: { height: 340, width: 543 }
    };

   return this.apollo.mutate({
      mutation: SEND_COMPLEX_DATA,
      variables: {
        data: complexData
      }
    });
  }



  downloadPdf(base64Data: string, fileName: string = 'account-statement.pdf'): void {
    // Convert base64 to blob
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes.buffer], { type: 'application/pdf' });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }


  getUsers(): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            users {
              id
              fullName
            }
          }
        `,
      })
      .valueChanges.pipe(map((result) => result.data.users));
  }


//   downloadPdf(base64Data: string, fileName: string = 'account-statement.pdf') {
//     try {
//       // Decode Base64 and convert to Blob
//       const byteCharacters = atob(base64Data);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
//       const blob = new Blob([byteArray], { type: 'application/pdf' });

//       // Create download link
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = fileName;

//       // Trigger download
//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       setTimeout(() => {
//         URL.revokeObjectURL(url);
//         document.body.removeChild(link);
//       }, 100);
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//     }
// }
}


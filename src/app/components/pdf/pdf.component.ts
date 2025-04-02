import { Component, ElementRef, ViewChild } from '@angular/core';
import { GraphqlService } from '../../services/graphql.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-pdf',
  imports: [CommonModule],
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
  standalone: true,
})
export class PdfComponent {
  invoiceData: any;
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  isLoading:boolean=false;
  errorMessage=''
  users: any[]=[];
  selectedUserId!: string;
  constructor(private pdfService:PdfService, private http: HttpClient) { }

  ngOnInit() {
    // this.gqlService.getInvoiceDetails().subscribe((response: any) => {
    //   this.invoiceData = response.data.getInvoiceDetails;
    // });
    this.pdfService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  onUserSelect(event: any): void {

    // console.log(userId)
    this.selectedUserId = event.target.value;
  }
 
  // generatePDF() {
  //   const htmlContent = this.pdfContent.nativeElement.innerHTML;

  //   this.gqlService.generatePDF(htmlContent).subscribe((response: any) => {
  //     const pdfUrl = response.data.generatePDF; // Assuming backend returns a URL or base64
  //     this.downloadPDF(pdfUrl);
  //   });
  // }
  generatePDF(): void {
    const startDate = new Date(2024, 0, 1).toISOString(); // January 1, 2024
    const endDate = new Date(2024, 11, 31).toISOString(); // December 31, 2024
    const includeTransactions = Math.random() > 0.5; // Randomly true or false


    // Hard-coded userId for demo - in real app would come from authentication
    const userId = this.selectedUserId;

    this.pdfService.generatePdf(userId, startDate, endDate, includeTransactions)
      .subscribe({
        next: (base64Pdf) => {
          this.pdfService.downloadPdf(
            base64Pdf,
            `account-statement-${startDate}-to-${endDate}.pdf`
          );
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = `Failed to generate PDF: ${err.message}`;
          this.isLoading = false;
        }
      });
  }

  sendData(){
    this.pdfService.sendData().subscribe({
      next: (result) => {
        console.log('Response:', result);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
  }
  


  downloadPDF(pdfUrl: string) {
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'invoice.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

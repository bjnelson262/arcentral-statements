import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Customer {
  id: string
  name: string
  customerNumber: string
  totalBalance: number
  email: string
}

interface StatementPreviewProps {
  customer: Customer
}

// Mock invoice data
const invoiceData = [
  {
    date: "August 21, 2024",
    invoiceNumber: "721241136",
    poNumber: "PO-2024-001",
    storeNumber: "Store 1",
    amount: 253.0,
    balance: 253.0,
  },
]

export function StatementPreview({ customer }: StatementPreviewProps) {
  return (
    <div className="bg-white">
      {/* Statement Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Statement</h1>

        <div className="grid grid-cols-2 gap-8">
          {/* Billed To Section */}
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-3">BILLED TO</h2>
            <div className="space-y-1 text-sm">
              <div className="font-semibold">{customer.name}</div>
              <div>5385 S FAIRFAX RD</div>
              <div>BLOOMINGTON, IN 47401</div>
              <div>812-345-3946</div>
              <div className="text-blue-600">{customer.email}</div>
              <div className="mt-3 space-y-1">
                <div>
                  <span className="font-medium">CUSTOMER NUMBER:</span> {customer.customerNumber}
                </div>
                <div>
                  <span className="font-medium">ACCOUNT:</span> 278962
                </div>
              </div>
            </div>
          </div>

          {/* Payable To Section */}
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-3">PAYABLE TO</h2>
            <div className="space-y-1 text-sm">
              <div className="bg-blue-600 text-white px-3 py-1 inline-block rounded mb-2">
                <span className="font-bold">Home City Ice</span>
              </div>
              <div className="font-semibold">THE HOME CITY ICE CO.</div>
              <div>P.O. Box 4633</div>
              <div>Cincinnati, Ohio 45211</div>
              <div>1-888-254-4633</div>

              <Card className="mt-4 bg-gray-50">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-700">
                    If mailing a check for payment, send a copy of this document to the address above.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Invoice Table */}
      <div className="mb-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 px-1 text-sm font-semibold">INVOICE DATE</th>
                <th className="text-left py-2 px-1 text-sm font-semibold">INVOICE No.</th>
                <th className="text-left py-2 px-1 text-sm font-semibold">P.O. No.</th>
                <th className="text-left py-2 px-1 text-sm font-semibold">STORE No.</th>
                <th className="text-right py-2 px-1 text-sm font-semibold">AMOUNT</th>
                <th className="text-right py-2 px-1 text-sm font-semibold">BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.map((invoice, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-1 text-sm">{invoice.date}</td>
                  <td className="py-2 px-1 text-sm text-blue-600 underline cursor-pointer">{invoice.invoiceNumber}</td>
                  <td className="py-2 px-1 text-sm">{invoice.poNumber}</td>
                  <td className="py-2 px-1 text-sm">{invoice.storeNumber}</td>
                  <td className="py-2 px-1 text-sm text-right">${invoice.amount.toFixed(2)}</td>
                  <td className="py-2 px-1 text-sm text-right">${invoice.balance.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300 font-semibold">
                <td colSpan={4} className="py-2 px-1 text-sm"></td>
                <td className="py-2 px-1 text-sm text-right">${customer.totalBalance.toFixed(2)}</td>
                <td className="py-2 px-1 text-sm text-right">${customer.totalBalance.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Button */}
      <div className="flex justify-center">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">PLACE PAYMENT</Button>
      </div>
    </div>
  )
}

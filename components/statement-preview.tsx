import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Customer {
  id: string
  name: string
  customerNumber: string
  totalBalance: number
  email: string
  selected: boolean
  emailStatus: string
  lastSent?: string | null
  deliveredAt?: string | null
  bouncedAt?: string | null
  failedAt?: string | null
  bounceReason?: string
  failureReason?: string
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
        <h1 className="text-3xl font-bold text-purple-900 mb-6">Statement</h1>

        <div className="grid grid-cols-2 gap-8">
          {/* Billed To Section */}
          <div>
            <h2 className="text-sm font-semibold text-purple-700 mb-3">BILLED TO</h2>
            <div className="space-y-1 text-sm">
              <div className="font-semibold text-purple-900">{customer.name}</div>
              <div className="text-purple-700">5385 S FAIRFAX RD</div>
              <div className="text-purple-700">BLOOMINGTON, IN 47401</div>
              <div className="text-purple-700">812-345-3946</div>
              <div className="text-purple-600 underline">{customer.email}</div>
              <div className="mt-3 space-y-1">
                <div className="text-purple-800">
                  <span className="font-medium">CUSTOMER NUMBER:</span> {customer.customerNumber}
                </div>
                <div className="text-purple-800">
                  <span className="font-medium">ACCOUNT:</span> 278962
                </div>
              </div>
            </div>
          </div>

          {/* Payable To Section */}
          <div>
            <h2 className="text-sm font-semibold text-purple-700 mb-3">PAYABLE TO</h2>
            <div className="space-y-1 text-sm">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 inline-block rounded mb-2">
                <span className="font-bold">Home City Ice</span>
              </div>
              <div className="font-semibold text-purple-900">THE HOME CITY ICE CO.</div>
              <div className="text-purple-700">P.O. Box 4633</div>
              <div className="text-purple-700">Cincinnati, Ohio 45211</div>
              <div className="text-purple-700">1-888-254-4633</div>

              <Card className="mt-4 bg-yellow-50 border-yellow-200">
                <CardContent className="p-3">
                  <p className="text-xs text-purple-800">
                    If mailing a check for payment, send a copy of this document to the address above.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6 bg-purple-200" />

      {/* Invoice Table */}
      <div className="mb-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-purple-300 bg-purple-50">
                <th className="text-left py-2 px-1 text-sm font-semibold text-purple-800">INVOICE DATE</th>
                <th className="text-left py-2 px-1 text-sm font-semibold text-purple-800">INVOICE No.</th>
                <th className="text-left py-2 px-1 text-sm font-semibold text-purple-800">P.O. No.</th>
                <th className="text-left py-2 px-1 text-sm font-semibold text-purple-800">STORE No.</th>
                <th className="text-right py-2 px-1 text-sm font-semibold text-purple-800">AMOUNT</th>
                <th className="text-right py-2 px-1 text-sm font-semibold text-purple-800">BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.map((invoice, index) => (
                <tr key={index} className="border-b border-purple-200 hover:bg-yellow-50">
                  <td className="py-2 px-1 text-sm text-purple-800">{invoice.date}</td>
                  <td className="py-2 px-1 text-sm text-purple-600 underline cursor-pointer hover:text-purple-800">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="py-2 px-1 text-sm text-purple-800">{invoice.poNumber}</td>
                  <td className="py-2 px-1 text-sm text-purple-800">{invoice.storeNumber}</td>
                  <td className="py-2 px-1 text-sm text-right text-purple-900 font-semibold">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-2 px-1 text-sm text-right text-purple-900 font-semibold">
                    ${invoice.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-purple-300 font-semibold bg-purple-50">
                <td colSpan={4} className="py-2 px-1 text-sm"></td>
                <td className="py-2 px-1 text-sm text-right text-purple-900">${customer.totalBalance.toFixed(2)}</td>
                <td className="py-2 px-1 text-sm text-right text-purple-900">${customer.totalBalance.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

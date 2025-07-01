"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Globe, MailIcon, Building2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Customer {
  id: string
  name: string
  customerNumber: string
  totalBalance: number
  email: string
  physicalAddress: string
  statementType: "email" | "mail"
  customerType: "Chain" | "Bill-To" | "Independent"
  representative: string
}

interface DisputedInvoice {
  invoiceNumber: string
  disputeReason: string
  disputeDate: string
  amount: number
}

interface StatementHistoryEntry {
  id: string
  dateSent: string
  deliveryAddress: string
  nameOnStatement: string
  currentBalance: number
  pastDueBalance: number
  statementType: "email" | "mail"
  disputedInvoices?: DisputedInvoice[]
}

interface CustomerStatementHistoryProps {
  customer: Customer
}

// Mock statement history data with disputes
const generateStatementHistory = (customer: Customer): StatementHistoryEntry[] => [
  {
    id: "1",
    dateSent: "2024-01-15T10:30:00Z",
    deliveryAddress: customer.statementType === "email" ? customer.email : customer.physicalAddress,
    nameOnStatement: customer.name,
    currentBalance: customer.totalBalance,
    pastDueBalance: 125.5,
    statementType: customer.statementType,
    disputedInvoices: [
      {
        invoiceNumber: "721241136",
        disputeReason: "Incorrect quantity billed",
        disputeDate: "2024-01-20T14:30:00Z",
        amount: 253.0,
      },
      {
        invoiceNumber: "721241140",
        disputeReason: "Product not received",
        disputeDate: "2024-01-22T09:15:00Z",
        amount: 189.5,
      },
    ],
  },
  {
    id: "2",
    dateSent: "2023-12-15T09:15:00Z",
    deliveryAddress: customer.statementType === "email" ? customer.email : customer.physicalAddress,
    nameOnStatement: customer.name,
    currentBalance: 450.75,
    pastDueBalance: 0,
    statementType: customer.statementType,
  },
  {
    id: "3",
    dateSent: "2023-11-15T14:22:00Z",
    deliveryAddress: customer.statementType === "email" ? customer.email : customer.physicalAddress,
    nameOnStatement: customer.name,
    currentBalance: 320.25,
    pastDueBalance: 85.0,
    statementType: customer.statementType,
    disputedInvoices: [
      {
        invoiceNumber: "721241098",
        disputeReason: "Billing error - overcharged",
        disputeDate: "2023-11-18T11:45:00Z",
        amount: 125.0,
      },
    ],
  },
  {
    id: "4",
    dateSent: "2023-10-15T11:45:00Z",
    deliveryAddress: customer.statementType === "email" ? customer.email : customer.physicalAddress,
    nameOnStatement: customer.name,
    currentBalance: 275.8,
    pastDueBalance: 0,
    statementType: customer.statementType,
  },
  {
    id: "5",
    dateSent: "2023-09-15T16:30:00Z",
    deliveryAddress: customer.statementType === "email" ? customer.email : customer.physicalAddress,
    nameOnStatement: customer.name,
    currentBalance: 198.45,
    pastDueBalance: 45.2,
    statementType: customer.statementType,
  },
]

function DisputeStatusButton({ disputedInvoices }: { disputedInvoices?: DisputedInvoice[] }) {
  const [currentDisputeIndex, setCurrentDisputeIndex] = useState(0)

  if (!disputedInvoices || disputedInvoices.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled className="text-gray-400 border-gray-200 bg-transparent">
        No Disputes
      </Button>
    )
  }

  const currentDispute = disputedInvoices[currentDisputeIndex]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {disputedInvoices.length} Dispute{disputedInvoices.length > 1 ? "s" : ""}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-red-200">
        <DialogHeader>
          <DialogTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Invoice Dispute Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-red-800">Invoice Number</h4>
                <p className="text-sm text-red-700 font-mono">{currentDispute.invoiceNumber}</p>
              </div>
              <div>
                <h4 className="font-medium text-red-800">Disputed Amount</h4>
                <p className="text-sm text-red-700 font-semibold">${currentDispute.amount.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="font-medium text-red-800">Dispute Date</h4>
                <p className="text-sm text-red-700">{new Date(currentDispute.disputeDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-red-800">Reason</h4>
                <p className="text-sm text-red-700">{currentDispute.disputeReason}</p>
              </div>
            </div>
          </div>

          {disputedInvoices.length > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDisputeIndex(Math.max(0, currentDisputeIndex - 1))}
                disabled={currentDisputeIndex === 0}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {disputedInvoices.map((_, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setCurrentDisputeIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentDisputeIndex ? "bg-red-600" : "bg-red-300"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {index + 1} of {disputedInvoices.length}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDisputeIndex(Math.min(disputedInvoices.length - 1, currentDisputeIndex + 1))}
                disabled={currentDisputeIndex === disputedInvoices.length - 1}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CustomerStatementHistory({ customer }: CustomerStatementHistoryProps) {
  const statementHistory = generateStatementHistory(customer)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      {/* Customer Info Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-yellow-50 p-4 rounded-lg border border-purple-200">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Customer Information</h4>
            <p className="text-sm text-purple-700">
              <span className="font-medium">Number:</span> {customer.customerNumber}
            </p>
            <p className="text-sm text-purple-700">
              <span className="font-medium">Current Balance:</span> ${customer.totalBalance.toFixed(2)}
            </p>
            <p className="text-sm text-purple-700">
              <span className="font-medium">Representative:</span> {customer.representative}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Customer Type</h4>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              <Badge
                className={
                  customer.customerType === "Chain"
                    ? "bg-blue-100 text-blue-800 border-blue-300"
                    : customer.customerType === "Bill-To"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-orange-100 text-orange-800 border-orange-300"
                }
              >
                {customer.customerType}
              </Badge>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Statement Delivery</h4>
            <div className="flex items-center gap-2">
              {customer.statementType === "email" ? (
                <Globe className="h-4 w-4 text-purple-600" />
              ) : (
                <MailIcon className="h-4 w-4 text-purple-600" />
              )}
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                {customer.statementType === "email" ? "Email" : "Physical Mail"}
              </Badge>
            </div>
            <p className="text-sm text-purple-700 mt-1">
              {customer.statementType === "email" ? customer.email : customer.physicalAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Statement History Table */}
      <div className="border border-purple-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50">
              <TableHead className="text-purple-800 font-semibold">Statement Sent</TableHead>
              <TableHead className="text-purple-800 font-semibold">
                Statement {customer.statementType === "email" ? "Email" : "Mail"} Address
              </TableHead>
              <TableHead className="text-purple-800 font-semibold">Name on Statement</TableHead>
              <TableHead className="text-right text-purple-800 font-semibold">Current Balance When Sent</TableHead>
              <TableHead className="text-right text-purple-800 font-semibold">Past Due Balance When Sent</TableHead>
              <TableHead className="text-center text-purple-800 font-semibold">Dispute Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statementHistory.map((entry, index) => (
              <TableRow key={entry.id} className={index % 2 === 0 ? "bg-white" : "bg-purple-25"}>
                <TableCell className="text-purple-800 font-medium">{formatDate(entry.dateSent)}</TableCell>
                <TableCell className="text-purple-700 text-sm">
                  <div className="flex items-center gap-2">
                    {entry.statementType === "email" ? (
                      <Globe className="h-3 w-3 text-purple-500" />
                    ) : (
                      <MailIcon className="h-3 w-3 text-purple-500" />
                    )}
                    <span className="truncate max-w-xs">{entry.deliveryAddress}</span>
                  </div>
                </TableCell>
                <TableCell className="text-purple-800 font-medium">{entry.nameOnStatement}</TableCell>
                <TableCell className="text-right font-mono text-purple-900 font-semibold">
                  ${entry.currentBalance.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono text-purple-900 font-semibold">
                  {entry.pastDueBalance > 0 ? (
                    <span className="text-red-600">${entry.pastDueBalance.toFixed(2)}</span>
                  ) : (
                    <span className="text-green-600">$0.00</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <DisputeStatusButton disputedInvoices={entry.disputedInvoices} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {statementHistory.length === 0 && (
        <div className="text-center py-8 text-purple-600">
          <p>No statement history available for this customer.</p>
        </div>
      )}
    </div>
  )
}

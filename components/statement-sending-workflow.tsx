"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Check, Printer, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { StatementPreview } from "./statement-preview"

interface Customer {
  id: string
  name: string
  customerNumber: string
  totalBalance: number
  email: string
  statementType: "email" | "mail"
  customerType: "Chain" | "Bill-To" | "Independent"
}

interface StatementSendingWorkflowProps {
  selectedCustomers: Customer[]
  onComplete: () => void
  onCancel: () => void
}

export function StatementSendingWorkflow({ selectedCustomers, onComplete, onCancel }: StatementSendingWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<"email" | "print" | "complete">("email")
  const [currentPrintIndex, setCurrentPrintIndex] = useState(0)
  const [emailsSent, setEmailsSent] = useState(false)
  const [printedStatements, setPrintedStatements] = useState<string[]>([])

  const emailCustomers = selectedCustomers.filter((c) => c.statementType === "email")
  const printCustomers = selectedCustomers.filter((c) => c.statementType === "mail")
  const currentPrintCustomer = printCustomers[currentPrintIndex]

  const handleSendEmails = async () => {
    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setEmailsSent(true)

    if (printCustomers.length > 0) {
      setCurrentStep("print")
    } else {
      setCurrentStep("complete")
    }
  }

  const handlePrintConfirmed = () => {
    setPrintedStatements([...printedStatements, currentPrintCustomer.id])

    if (currentPrintIndex < printCustomers.length - 1) {
      setCurrentPrintIndex(currentPrintIndex + 1)
    } else {
      setCurrentStep("complete")
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  if (currentStep === "email" && emailCustomers.length > 0) {
    return (
      <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent className="border-purple-200">
          <DialogHeader>
            <DialogTitle className="text-purple-800 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Email Statements
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Ready to Send</h4>
                    <p className="text-sm text-green-700">
                      {emailCustomers.length} email statement{emailCustomers.length > 1 ? "s" : ""} will be sent
                    </p>
                  </div>
                  <Send className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {emailCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="text-sm text-purple-800">{customer.name}</span>
                  <span className="text-xs text-purple-600 font-mono">{customer.email}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSendEmails} className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4 mr-2" />
                Send All Emails
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (currentStep === "print" && printCustomers.length > 0) {
    return (
      <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto border-purple-200">
          <DialogHeader>
            <DialogTitle className="text-purple-800 flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Print Statement - {currentPrintCustomer.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {emailsSent && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      {emailCustomers.length} email statement{emailCustomers.length > 1 ? "s" : ""} sent successfully
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPrintIndex(Math.max(0, currentPrintIndex - 1))}
                  disabled={currentPrintIndex === 0}
                  className="border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm text-purple-700 font-medium">
                  Statement {currentPrintIndex + 1} of {printCustomers.length}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPrintIndex(Math.min(printCustomers.length - 1, currentPrintIndex + 1))}
                  disabled={currentPrintIndex === printCustomers.length - 1}
                  className="border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {printCustomers.map((_, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setCurrentPrintIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              printedStatements.includes(printCustomers[index].id)
                                ? "bg-green-600"
                                : index === currentPrintIndex
                                  ? "bg-purple-600"
                                  : "bg-purple-300 hover:bg-purple-400"
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {index + 1} of {printCustomers.length} - {printCustomers[index].name}
                            {printedStatements.includes(printCustomers[index].id) && " (Printed)"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>

                <Button onClick={handlePrintConfirmed} className="bg-purple-600 hover:bg-purple-700">
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Printed
                </Button>
              </div>
            </div>

            <div className="border border-purple-200 rounded-lg p-6 bg-white">
              <StatementPreview customer={currentPrintCustomer} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (currentStep === "complete") {
    return (
      <Dialog open={true} onOpenChange={handleComplete}>
        <DialogContent className="border-green-200">
          <DialogHeader>
            <DialogTitle className="text-green-800 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Statements Sent Successfully
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  {emailCustomers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        {emailCustomers.length} email statement{emailCustomers.length > 1 ? "s" : ""} sent
                      </span>
                    </div>
                  )}
                  {printCustomers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Printer className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        {printCustomers.length} statement{printCustomers.length > 1 ? "s" : ""} printed
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}

"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, Calendar, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { StatementPreview } from "./statement-preview"

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

interface AllStatementsViewProps {
  customer: Customer
}

// Mock all statements data (limited to 5 as requested)
const generateAllStatements = (customer: Customer) => [
  {
    id: "1",
    date: "2024-01-15",
    monthYear: "January 2024",
    balance: customer.totalBalance,
  },
  {
    id: "2",
    date: "2023-12-15",
    monthYear: "December 2023",
    balance: 450.75,
  },
  {
    id: "3",
    date: "2023-11-15",
    monthYear: "November 2023",
    balance: 320.25,
  },
  {
    id: "4",
    date: "2023-10-15",
    monthYear: "October 2023",
    balance: 275.8,
  },
  {
    id: "5",
    date: "2023-09-15",
    monthYear: "September 2023",
    balance: 198.45,
  },
]

export function AllStatementsView({ customer }: AllStatementsViewProps) {
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const allStatements = generateAllStatements(customer)
  const currentStatement = allStatements[currentStatementIndex]

  const handleSearch = () => {
    const foundIndex = allStatements.findIndex((statement) =>
      statement.monthYear.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    if (foundIndex !== -1) {
      setCurrentStatementIndex(foundIndex)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Navigation Controls */}
      <Card className="border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-purple-500" />
                <Input
                  placeholder="Search by month/year (e.g., January 2024)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-80 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-100 bg-transparent"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900 font-semibold shadow-lg"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Statement
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStatementIndex(Math.max(0, currentStatementIndex - 1))}
                disabled={currentStatementIndex === 0}
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <span className="text-sm text-purple-700 font-medium">{currentStatement.monthYear}</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStatementIndex(Math.min(allStatements.length - 1, currentStatementIndex + 1))}
                disabled={currentStatementIndex === allStatements.length - 1}
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Statement Navigation Dots */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              {allStatements.map((_, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setCurrentStatementIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentStatementIndex ? "bg-purple-600" : "bg-purple-300 hover:bg-purple-400"
                        }`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {index + 1} of {allStatements.length} - {allStatements[index].monthYear}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statement Preview */}
      <div className="border border-purple-200 rounded-lg p-6 bg-white">
        <StatementPreview
          customer={{
            ...customer,
            totalBalance: currentStatement.balance,
          }}
        />
      </div>
    </div>
  )
}

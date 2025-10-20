import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, IndianRupee } from "lucide-react";

interface PricingItem {
  service: string;
  description: string;
  costUSD: number;
}

interface PricingTableProps {
  items: PricingItem[];
}

const PricingTable = ({ items }: PricingTableProps) => {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const exchangeRate = 83; // Approximate USD to INR rate

  const convertPrice = (usdPrice: number) => {
    return currency === "USD" ? usdPrice : Math.round(usdPrice * exchangeRate);
  };

  const formatPrice = (price: number) => {
    return currency === "USD" 
      ? `$${price.toLocaleString()}` 
      : `₹${price.toLocaleString('en-IN')}`;
  };

  const totalUSD = items.reduce((sum, item) => sum + item.costUSD, 0);

  return (
    <Card className="p-6 bg-card shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Investment Breakdown</h3>
        <div className="flex gap-2">
          <Button
            variant={currency === "USD" ? "hero" : "outline"}
            size="sm"
            onClick={() => setCurrency("USD")}
            className="gap-1"
          >
            <DollarSign className="h-4 w-4" />
            USD
          </Button>
          <Button
            variant={currency === "INR" ? "hero" : "outline"}
            size="sm"
            onClick={() => setCurrency("INR")}
            className="gap-1"
          >
            <IndianRupee className="h-4 w-4" />
            INR
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-foreground">Service</TableHead>
            <TableHead className="font-semibold text-foreground">Description</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Investment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-foreground">{item.service}</TableCell>
              <TableCell className="text-muted-foreground">{item.description}</TableCell>
              <TableCell className="text-right font-semibold text-foreground">
                {formatPrice(convertPrice(item.costUSD))}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/30">
            <TableCell colSpan={2} className="font-bold text-foreground text-lg">
              Total Investment
            </TableCell>
            <TableCell className="text-right font-bold text-primary text-lg">
              {formatPrice(convertPrice(totalUSD))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <p className="text-sm text-muted-foreground mt-4 text-center">
        💡 Flexible payment plans available. Let's discuss what works best for you!
      </p>
    </Card>
  );
};

export default PricingTable;

'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const Converter = ({ symbol, icon, priceList }: ConverterProps) => {
  const [currency, setCurrency] = useState("usd");
  const [amount, setAmount] = useState("10");

  const convertedPrice = (parseFloat(amount) || 0) * (priceList[currency] || 0);

  return (
    <div id="converter">
      <h4>{symbol.toUpperCase()} Converter</h4>

      <div className="panel">
        <div className="input-wrapper">
          <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="input" />

          <div className="coin-info">
            <Image src={icon} alt={symbol} width={20} height={20} />
            <p>{symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="divider">
          <div className="line" />

          <Image src="/assets/converter.svg" alt="Converter" />
        </div>
      </div>
    </div>
  )
}

export default Converter
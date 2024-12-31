import Link from 'next/link'

export default function TopHeader() {
    return  <div className="h-left">
  <div className="shipping-offer desktop-only">
  FREE SHIPPING ON ORDERS OVER $99 (USA Only) & 
  <Link href="/" className="shipping-link"> QUICK SHIP AVAILABLE</Link>
  </div>
</div>
  }
import Link from 'next/link';

const FooterUserLinks = () => {
  return (
    <div className="ftr_column">
      <h4 className='ftr_title'>Account</h4>
      <ul className="ftr_list">
        <li><Link href="/login.php">Log In</Link></li>
        <li><Link href="/login.php?action=create_account">Sign Up</Link></li>
        <li><Link href="/login.php?dealer_login">Dealer Login</Link></li>
      </ul>
    </div>
  );
}

export default FooterUserLinks;

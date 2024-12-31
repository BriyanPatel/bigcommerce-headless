import { FragmentOf, graphql } from '~/client/graphql';
import Link from 'next/link';

export const CopyrightFragment = graphql(`
  fragment CopyrightFragment on Settings {
    storeName
  }
`);

interface Props {
  data: FragmentOf<typeof CopyrightFragment>;
}

export const Copyright = ({ data }: Props) => {
  return (
    <p className="copyright_text">
      © {new Date().getFullYear()} {data.storeName} – Powered by <Link href="https://www.marketingsuccess.com/" target='_blank' rel="noopener noreferrer">Marketing Success</Link>
    </p>
  );
};

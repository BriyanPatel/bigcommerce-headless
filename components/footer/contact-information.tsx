import { Fragment } from 'react';

import { FragmentOf, graphql } from '~/client/graphql';

export const ContactInformationFragment = graphql(`
  fragment ContactInformationFragment on Settings {
    contact {
      address
      phone
    }
  }
`);

interface Props {
  data: FragmentOf<typeof ContactInformationFragment>;
}

export const ContactInformation = ({ data }: Props) => {
  const { contact } = data;

  if (!contact) {
    return null;
  }

  return (
    <>
      <address className="not-italic">
        {contact.address.split('\n').map((line) => (
          <Fragment key={line}>
            {line}
            <br />
          </Fragment>
        ))}
      </address>

      {contact.phone ? (
        <p className='contact_no'><strong>Phone: </strong>
        <a className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          href={`tel:${contact.phone}`}
        >
          {contact.phone}
        </a>
        </p>
      ) : null}
      
    </>
  );
};

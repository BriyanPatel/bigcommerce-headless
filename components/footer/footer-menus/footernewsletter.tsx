import React from 'react';

const FooterNewsletter = () => {
  return (
    <>
      <h4 className="ftr_title">Newsletter Sign Up</h4>
      <p>Sign up to get the latest info on web specials, sales, product information, and more...</p>
      <form className="form" action="/subscribe.php" method="post">
        <fieldset className="form-fieldset">
          <input type="hidden" name="action" value="subscribe" />
          <input type="hidden" name="nl_first_name" value="bc" />
          <input type="hidden" name="check" value="1" />
          <div className="form-field">
            <label className="form-label is-srOnly" htmlFor="nl_email">Email Address</label>
            <div className="form-prefixPostfix wrap">
              <input
                className="form-input"
                id="nl_email"
                name="nl_email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <input
                className="button button--primary form-prefixPostfix-button--postfix"
                type="submit"
                value="Subscribe"
              />
            </div>
          </div>
        </fieldset>
      </form>
      </>
  );
};

export default FooterNewsletter;

import React, { useEffect } from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';

const PrivacyAndCookiePolicy = () => {
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">
              Privacy notice for Home Office and other Government departments’ workforces
            </h1>
            <p className="govuk-body">
              Provision of the Central Operations Platform (COP) is from Borders Systems and the
              Digital, Data and Technology directorate, both of which are part of the Home Office.
            </p>
            <p className="govuk-body">
              The data controller for COP is Border Force – a data controller determines how and why
              personal data can be processed. You can request our Data Protection Impact Assessment
              and Data Management Policy from the COP team.
            </p>
            <h2 className="govuk-heading-m">What data we need</h2>
            <p className="govuk-body">The personal data we collect from you on COP may include:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>your full name</li>
              <li>your job role and team</li>
              <li>your Adelphi or Metis personal number</li>
              <li>your mandatory declaration</li>
              <li>your security clearance levels and expiry date</li>
              <li>
                your Internet Protocol (IP) address, and details of which version of web browser and
                device that you used
              </li>
              <li>
                information on how you use the site, using cookies and page tagging techniques:
                <ul className="govuk-list govuk-list--bullet">
                  <li>the pages you visit on cop.homeoffice.gov.uk</li>
                  <li>how long you spend on each cop.homeoffice.gov.uk page</li>
                  <li>what you click on while you’re visiting the site</li>
                </ul>
              </li>
              <li>your POISE ID</li>
              <li>your Home Office email address</li>
              <li>your mobile phone number</li>
              <li>pages that you view</li>
            </ul>
            <p className="govuk-body">
              All information added to the platform is linked to your unique user ID for audit
              purposes.
            </p>
            <p className="govuk-body">
              Please note if you are accessing COP outside of Border Force, i.e. if you are a member
              of staff or contractor at Immigration Enforcement, UK Visas & Immigration, HM Revenue
              and Customs, National Crime Agency or Leicestershire Police, you will not be required
              to provide the following information outlined above:
            </p>
            <ul className="govuk-list govuk-list--bullet">
              <li>your Adelphi or Metis personal number</li>
              <li>your mandatory declaration</li>
              <li>your security clearance levels and expiry date</li>
              <li>your POISE ID (except IE, UKVI and NCA)</li>
            </ul>
            <p className="govuk-body">
              For users from HM Revenue and Customs, we will additionally collect the following
              information:
            </p>
            <ul className="govuk-list govuk-list--bullet">
              <li>your Stride ID</li>
            </ul>
            <p className="govuk-body">For users from Leicestershire Police:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>
                your Home Office digital handle (i.e. firstname.lastname@digital.homeoffice.gov.uk)
                which is used to provide access
              </li>
            </ul>
            <p className="govuk-body">
              Under the Data Protection Act 2018, we are processing this information on a
              performance-of-a-public-task basis to allow you to conduct your duties as a Border
              Force employee or a user of the Central Operation Platform. We are also reliant on
              contractual processing of your data (this is only applicable to Border Force users).
            </p>
            <p className="govuk-body">
              We use cookies to do this and you cannot access the COP from a non-Home Office device.
            </p>
            <p className="govuk-body">
              This privacy policy applies only to the actions of COP and users of COP. It does not
              extend to any websites that can be accessed from COP.
            </p>
            <h2 className="govuk-heading-m">Cookies</h2>
            <p className="govuk-body">
              Cookies allow COP to understand how the platform is used in order to improve the
              service, such as identifying the time period when the service is used least so that
              updates to the service can be pushed out at these times or streamlining how pages are
              accessed based on how users click through the site.
            </p>
            <p className="govuk-body">
              COP uses cookies to collect and use data as part of our services. By continuing to use
              the service, you are agreeing to the use of cookies and similar technologies for the
              purposes described in the policy. At the time of writing, all cookies used by COP are
              essential to the use of the service and you cannot opt out of them.
            </p>
            <p className="govuk-body">
              COP uses both persistent and session Matomo cookies. The two types of persistent
              cookies are:
            </p>
            <ul className="govuk-list govuk-list--bullet">
              <li>
                _pk_id: used to store a few details about you such as the unique visitor ID, stored
                for 13 months
              </li>
              <li>
                _pk_ref: used to store information to initially identify you when you visit the
                website, stored for 6 months
              </li>
            </ul>
            <p className="govuk-body">The two types of session cookies are:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>_pk_hsr: heatmap and session recording</li>
              <li>_pk_ses: used to store data for the visit for 30 minutes</li>
            </ul>
            <p className="govuk-body">
              A user can remove cookies by deleting them from the browser. This can be done by
              clicking ctrl+H and navigating to the option to clear history, of which cookies can
              usually be found as a subset.
            </p>
            <h2 className="govuk-heading-m">Why we need this data</h2>
            <p className="govuk-body">
              We use this information to enable you to log in to the service that we provide and to
              link information you add into COP to your account.
            </p>
            <p className="govuk-body">
              We use the information that you provide to help make sure that we can enforce access
              control and keep data secure.
            </p>
            <p className="govuk-body">
              We use information about your email and your name that we hold within the system when
              we send you a notification. We use the GOV.UK Notify service to send you notifications
              from COP to your Home Office email address; this service is operated and assured by
              the Cabinet Office.
            </p>
            <p className="govuk-body">
              The legal basis for processing your personal data is for the performance of a public
              task and under contract (for Border Force only).
            </p>
            <p className="govuk-body">
              We use a service called Matomo to collect information about how you use the COP. We do
              this to help make sure that the site is meeting the needs of its users and help us to
              make improvements to the site and service that we provide.
            </p>
            <h2 className="govuk-heading-m">What we do with your data</h2>
            <p className="govuk-body">
              The data we collect may be shared with supplier organisations, other government
              departments, agencies and public bodies, but only when there is an appropriate
              business need that will be facilitated by sharing this data. For example, we will
              share some information with Home Office Performance and Reporting Analytics Unit
              (PRAU) for MI Reporting, information shared with UKVI and IE as part of the “e-forms”
              workflows and information will be shared with HMRC, NCA and Leicestershire Police for
              the Multi-Agency Hub for Fast Parcels use of Events at the Border.
            </p>
            <p className="govuk-body">We will not:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>sell or rent your data to third parties</li>
              <li>share your data with third parties for marketing purposes</li>
            </ul>
            <p className="govuk-body">
              We will share your data if we are required to do so by law – for example, by court
              order, or to prevent fraud or other crime.
            </p>
            <p className="govuk-body">
              Information captured via cookies within Matomo includes a unique visitor ID,
              information to initially identify a user when a website is visited, analytical
              information and session data temporarily stored for the visit.
            </p>
            <h2 className="govuk-heading-m">How long we keep your data</h2>
            <p className="govuk-body">We will only retain your personal data for as long as:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>it is needed for the purposes set out in this document</li>
              <li>the law requires us to</li>
            </ul>
            <p className="govuk-body">
              In general, this means that we will only hold your personal data for the time you are
              a member of Border Force and then a maximum of 5 years after you leave Border Force.
              For members of other Home Office departments and other Government departments we will
              hold your data for the time you use COP and then for audit purposes for a maximum of 5
              years after you are no longer a user. This allows us to ensure the ability to robustly
              audit past use of the system and provide context for who accessed the system and data.
            </p>
            <h2 className="govuk-heading-m">Where your data is processed and stored</h2>
            <p className="govuk-body">
              We design, build and run our systems to make sure that your data is as safe as
              possible at any stage, both while it’s processed and when it’s stored. We store your
              data on an assured platform within the UK.
            </p>
            <p className="govuk-body">
              We use GOV.UK Notify, a service provided by Cabinet Office, to send you notifications
              about COP. Any information included in the notification email or SMS is stored in
              Notify for a maximum of 7 days; this is stored within the European Economic Area
              (EEA).
            </p>
            <h2 className="govuk-heading-m">How we protect your data and keep it secure</h2>
            <p className="govuk-body">
              We are committed to doing all that we can to keep your data secure. We have set up
              systems and processes to prevent unauthorised access or disclosure of your data – for
              example, we protect your data using varying levels of encryption.
            </p>
            <p className="govuk-body">
              We also make sure that any third parties that we deal with keep all personal data they
              process on our behalf secure.
            </p>
            <h2 className="govuk-heading-m">What are your rights?</h2>
            <p className="govuk-body">You have the right to request:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>information about how your personal data is processed</li>
              <li>
                a copy of that personal data - this copy will be provided in a structured, commonly
                used and machine-readable format
              </li>
              <li>that anything inaccurate in your personal data is corrected immediately</li>
            </ul>
            <p className="govuk-body">You can also:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>raise an objection about how your personal data is processed</li>
              <li>
                request that your personal data is erased if there is no longer a justification for
                it
              </li>
              <li>
                ask that the processing of your personal data is restricted in certain circumstances
              </li>
            </ul>
            <p className="govuk-body">
              If you have any of these requests, get in contact with the COP team by raising a
              support request at the{' '}
              <a
                className="govuk-footer__link"
                href="https://support.cop.homeoffice.gov.uk/servicedesk/customer/portal/3"
                target="_blank"
                rel="noopener noreferrer"
              >
                Service Desk
              </a>
              .
            </p>
            <p className="govuk-body">
              If you are unsatisfied with how we respond to your request please escalate this to the
              Office of the Data Protection Officer within the Home Office, either through the forms
              on Horizon or by emailing{' '}
              <a
                className="govuk-footer__link"
                href="mailto:dpo@homeoffice.gov.uk"
                target="_blank"
                rel="noopener noreferrer"
              >
                dpo@homeoffice.gov.uk
              </a>
              .
            </p>
            <h2 className="govuk-heading-m">Changes to this notice</h2>
            <p className="govuk-body">
              We may modify or amend this privacy notice at our discretion at any time. When we make
              changes to this notice we will amend the last modified date at the bottom of this
              page. Any modification or amendment to this privacy notice will be applied to you and
              your data as of that revision date. We encourage you to periodically review this
              privacy notice to be informed about how we are protecting your data.
            </p>
            <p className="govuk-body">Last modified on 24 March 2021.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyAndCookiePolicy;

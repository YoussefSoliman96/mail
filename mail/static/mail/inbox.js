document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').addEventListener('submit', send_email);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

   // Request the emails for a particular mailbox
   fetch(`/emails/${mailbox}`)
   .then(response => response.json())
   .then(emails => {
     // Show each email in the mailbox
     emails.forEach(email => {
      console.log(email);
      const element = document.createElement('div');
      element.className = "list-group-item list-group-item-action";
      element.style.cssText = "display:flex; margin:auto; gap:70px; height:45px";
      
      // Style the email inbox/sent list items
      element.innerHTML = `

            <h6 style="color:black;">${email.sender}</h6>
            <p style="color:black;">${email.subject}</p>
            <p class="text-muted" style="font-size:12px; margin-left: auto">${email.timestamp}<p>

      `;
      console.log(email.read)
      if (email.read === false) {
        element.classList.add('bg-light')
      }


      element.addEventListener('click', function() {
          console.log('This element has been clicked!')
      });
      document.querySelector('#emails-view').append(element);
     });

 });
}

 

function send_email(event) {
  event.preventDefault();
  const recipient = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipient,
        subject: subject,
        body: body,
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
}
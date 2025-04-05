import { db } from './drizzle';
import {
  emails,
  folders,
  threadFolders,
  threads,
  userFolders,
  users,
} from './schema';

async function seed() {
  console.log('Starting seed process...');
  await seedUsers();
  await seedFolders();
  await seedThreadsAndEmails();
  console.log('Seed process completed successfully.');
}

async function seedUsers() {
  await db.insert(users).values([
    {
      firstName: 'Agboola',
      lastName: 'Boluatife',
      email: 'bolutifegboola@gmail.com',
      jobTitle: 'Software Engineer',
      company: 'Erudyte',
      location: 'Lagos, Nigeria',
      avatarUrl: 'https://github.com/ceeprel.png',
      linkedin: 'https://www.linkedin.com/in/ceeprel/',
      twitter: 'https://x.com/ceeprel3',
      github: 'https://github.com/ceeprel',
    },
    {
      firstName: 'Murewa ',
      lastName: 'Olubela',
      email: 'MurewaOlubela@erudytion.com',
      jobTitle: 'CEO',
      company: 'Erudite',
      location: 'Tampa, Florida',
      avatarUrl: 'https://www.linkedin.com/in/murewa/overlay/photo/',
    },
    {
      firstName: 'Delba',
      lastName: 'de Oliveira',
      email: 'delba.oliveira@erudyte.com',
      jobTitle: 'Staff DX Engineer',
      company: 'Erudyte',
      location: 'London, UK',
      avatarUrl: 'https://github.com/delbaoliveira.png',
    },
    {
      firstName: 'Tim',
      lastName: 'Neutkens',
      email: 'tim@erudyte.com',
      jobTitle: 'Next.js Lead',
      company: 'Erudyte',
      location: 'Amsterdam, Netherlands',
      avatarUrl: 'https://github.com/timneutkens.png',
    },
  ]);
}

async function seedFolders() {
  await db
    .insert(folders)
    .values([
      { name: 'Inbox' },
      { name: 'Flagged' },
      { name: 'Sent' },
      { name: 'Archive' },
      { name: 'Spam' },
      { name: 'Trash' },
    ]);

  const userFolderValues = [];
  for (let userId = 1; userId <= 4; userId++) {
    for (let folderId = 1; folderId <= 6; folderId++) {
      userFolderValues.push({ userId, folderId });
    }
  }
  await db.insert(userFolders).values(userFolderValues);
}

async function seedThreadsAndEmails() {
  // Thread 1: Guillermo talking about Erudyte feedback
  const thread1 = await db
    .insert(threads)
    .values({
      subject: 'Erudyte Feedback and Updates',
      lastActivityDate: new Date('2024-05-15T10:00:00'),
    })
    .returning();

  await db.insert(emails).values([
    {
      threadId: thread1[0].id,
      senderId: 2, // Guillermo
      recipientId: 1, // Agboola
      subject: 'Erudyte Feedback and Updates',
      body: 'Met with Daniel today. He had some great feedback about the STEM subjects module. After you implement the changes, he suggests we make it interactive. Thoughts?',
      sentDate: new Date('2024-05-15T10:00:00'),
    },
    {
      threadId: thread1[0].id,
      senderId: 1, // Agboola
      recipientId: 2, // Guillermo
      subject: 'Re: Erudyte Feedback and Updates',
      body: "Good call. Let's make it more engaging for students. We can add a real-time quiz feature to assess understanding.",
      sentDate: new Date('2024-05-15T11:30:00'),
    },
    {
      threadId: thread1[0].id,
      senderId: 2, // Guillermo
      recipientId: 1, // Agboola
      subject: 'Re: Erudyte Feedback and Updates',
      body: "Great! Let me know when the update is live, and I'll help promote it.",
      sentDate: new Date('2024-05-15T13:45:00'),
    },
  ]);

  // Thread 2: Delba talking about new STEM features in Erudyte
  const thread2 = await db
    .insert(threads)
    .values({
      subject: 'New STEM Feature in Erudyte',
      lastActivityDate: new Date('2024-05-16T09:00:00'),
    })
    .returning();

  await db.insert(emails).values([
    {
      threadId: thread2[0].id,
      senderId: 3, // Delba
      recipientId: 1, // Agboola
      subject: 'New STEM Feature in Erudyte',
      body: "We're adding a new AI-based feature for personalized STEM tutoring. Want to review the first draft of the design?",
      sentDate: new Date('2024-05-16T09:00:00'),
    },
    {
      threadId: thread2[0].id,
      senderId: 1, // Agboola
      recipientId: 3, // Delba
      subject: 'Re: New STEM Feature in Erudyte',
      body: "Yes, I'd love to see it! I'll provide feedback by tonight.",
      sentDate: new Date('2024-05-16T10:15:00'),
    },
    {
      threadId: thread2[0].id,
      senderId: 3, // Delba
      recipientId: 1, // Agboola
      subject: 'Re: New STEM Feature in Erudyte',
      body: 'Thanks! Looking forward to your insights.',
      sentDate: new Date('2024-05-16T11:30:00'),
    },
  ]);

  // Thread 3: Tim discussing technical steps for Erudyte's STEM module testing
  const thread3 = await db
    .insert(threads)
    .values({
      subject: 'Testing New STEM Module in Erudyte',
      lastActivityDate: new Date('2024-05-17T14:00:00'),
    })
    .returning();

  await db.insert(emails).values([
    {
      threadId: thread3[0].id,
      senderId: 4, // Tim
      recipientId: 1, // Agboola
      subject: 'Steps to Test New STEM Module in Erudyte',
      body: `Hi Agboola,

Here are the steps to test the new STEM module:

1. Install the latest Erudyte version
2. Enable the AI tutor feature in the settings
3. Test with sample student profiles
4. Evaluate the interactive STEM exercises
5. Share feedback on usability

Let me know if you encounter any issues!

Best,  
Tim`,
      sentDate: new Date('2024-05-17T14:00:00'),
    },
  ]);

  // Add threads to folders
  await db.insert(threadFolders).values([
    { threadId: thread1[0].id, folderId: 1 }, // Inbox
    { threadId: thread2[0].id, folderId: 1 }, // Inbox
    { threadId: thread3[0].id, folderId: 1 }, // Inbox
  ]);
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });

// settings/team.js - EDIT THIS FILE to add, remove or change team members on the "Our Team" page.
// One block per person. Copy a block, change the details, keep the comma after the closing brace.
//   role:     leave '' for now. When you add a designation, it appears under the name automatically.
//   photo:    leave '' to show initials. To add a photo, save it in the images/team/ folder and
//             write only the file name here, e.g.  photo: 'kunal.jpg'
//   bio:      optional short introduction (shown only if filled)
//   linkedin / phone / email: leave '' to hide that item for the person.

export const PHOTO_DIR = 'images/team/';   // folder where team photos are kept

export const TEAM_SHOW = {   // switch a type off for EVERYONE (e.g. hide phone numbers on the public site)
  linkedin: true,
  email: true,
  phone: true,
};

export const TEAM = [
  {
    name: 'Kunal Dalotra',
    role: '',
    bio: '',
    photo: '',
    linkedin: 'https://www.linkedin.com/in/kunal-dalotra/',
    phone: '+91 8899883638',
    email: 'kunaldalotra02@gmail.com',
  },
  {
    name: 'Rupali Thakur',
    role: '',
    bio: '',
    photo: '',
    linkedin: 'https://www.linkedin.com/in/rupali-thakur-530014201/',
    phone: '+91 9682532516',
    email: 'shallacommunity@gmail.com',
  },
  {
    name: 'Rohit Singh',
    role: '',
    bio: '',
    photo: '',
    linkedin: 'https://www.linkedin.com/in/rohit-singh-it/',
    phone: '+91 6006517282',
    email: 'rohitkatal466@gmail.com',
  },
  {
    name: 'Sajid Malik',
    role: '',
    bio: '',
    photo: '',
    linkedin: 'https://www.linkedin.com/in/sajid-malik-a6984b433/',
    phone: '+91 6005730781',
    email: 'sajidmalik987827@gmail.com',
  },
  {
    name: 'Shubhum Kumar',
    role: '',
    bio: '',
    photo: '',
    linkedin: '',
    phone: '+91 7051041411',
    email: 'shubhum7raj@gmail.com',
  },
];

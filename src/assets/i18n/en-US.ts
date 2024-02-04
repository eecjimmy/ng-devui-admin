export default {
  'abnormal': {
    '403': {
      'description': 'Sorry, you don\'t have access to this page.',
    },
    '404': {
      'description': 'Sorry, the page you visited does not exist.',
    },
    '500': {
      'description': 'Sorry, the server is reporting an error.',
    },
    'backHome': 'Back Home',
  },
  'authNotice': {
    'summary': 'Info',
    'content': 'Please login first!',
  },
  'dashboard': {
    'breadcrumb': {
      'home': 'Home',
      'dashboardPage': 'Dashboard',
      'workSpace': 'Work Space',
    },
    'analysis': {
      'visitingData': 'Data Flow In A Week',
      'serviceWaterLine': 'Service Level Variation',
      'userVisiting': 'User Visiting',
      'requirementType': 'Requirement Type Tendency',
      'taskComplete': 'Task Completed Situation',
    },
    'monitor': {
      'taskComplete': 'Task Completion Monitor',
      'occupancy': 'Occupancy Rate',
      'userDistribute': 'User Distribution',
      'tendency': 'Tendency',
      'taskExec': 'Task Execution',
    },
    'workSpace': {
      'name': 'Work Space',
      'descriptionPrefix': 'Hello',
      'descriptionSuffix': 'welcome to your work space',
      'title': 'Front-End Expert',
      'role': 'DevUI-Committer',
    },
  },
  'footer': {
    'presented': 'DevUI Design Presented',
  },
  'form': {
    'breadcrumb': {
      'home': 'Home',
      'formPage': 'Form',
      'basicForm': 'Basic Form',
      'formLayout': 'Form Layout',
      'advancedForm': 'Advanced Form',
      'dynamicForm': 'Dynamic Form',
    },
    'basicForm': {
      'title': 'Basic Form',
      'description': 'The form page is used to collect or verify user information. Basic forms can be used to collect, verify, and submit data.',
    },
    'formLayout': {
      'title': 'Form Layout',
      'description': 'The form layout page displays various forms, including horizontal, vertical, pop-up, and multi-column layouts.',
      'horizontalForm': 'Horizontal Form',
      'verticalForm': 'Vertical Form',
      'modalForm': 'Pop-up Form',
      'multiForm': 'Multi-column Form',
    },
    'advancedForm': {
      'title': 'Advanced Form',
      'description': 'Advanced forms are used to edit related information in the list.',
    },
    'dynamicForm': {
      'title': 'Dynamic Form',
      'description': 'Dynamic forms can be created based on the metadata (JSON) of the business object model. The creation is quick, structured, and easy to maintain. For details about the differences between forms and normal forms, see the actual code.',
    },
  },
  'header': {
    'userCenter': 'User Center',
    'userSettings': 'User Settings',
    'logout': 'Logout',
    'login': 'Login',
    'register': 'Register',
  },
  'list': {
    'breadcrumb': {
      'home': 'Home',
      'formPage': 'List',
      'basicList': 'Basic List',
      'cardList': 'Card List',
      'editableList': 'Editable List',
      'advanceList': 'Advance List',
      'treeList': 'Tree List',
    },
    'basicList': {
      'title': 'Basic List',
      'description': 'Allows users to adjust the list size and spacing.',
    },
    'cardList': {
      'title': 'Card List',
      'description': 'Information can be displayed in card format and the search function is supported.',
    },
    'editableList': {
      'title': 'Editable List',
      'description': 'Supports table extension and table editing.',
    },
    'advanceList': {
      'title': 'Advance List',
      'description': 'Allows users to select multiple items in the list and delete them in batches. Allows users to adjust the column width by dragging and dragging. Supports virtual scrolling, lazy loading, and filtering.',
    },
    'treeList': {
      'title': 'Tree List',
      'description': 'Tree table rendering is supported.',
    },
  },
  'loginPage': {
    'loginWays': {
      'account': 'Account Login',
      'email': 'Email Login',
    },
    'autoLogin': 'Remember me',
    'forgetPassword': 'Forgot Password?',
    'submit': 'Submit',
    'userName': 'Username',
    'password': 'Password',
    'email': 'Email',
    'noticeMessage': {
      'summary': 'Login Failed',
      'accountContent':
        'Please input correct username and password, username: Admin, password: DevUI.admin',
      'emailContent':
        'Please input correct username and password, username: admin@devui.com, password: devuiadmin',
    },
    'other': 'Sign in with',
    'register': 'Sign up',
    'callbackMessage': 'Github authorization callback succeeded',
  },
  'notice': {
    'clear': 'Empty All',
    'notificationTabName': 'Notifications',
    'messageTabName': 'Messages',
    'todoTabName': 'Todos',
    'done': 'You have viewed all messages',
    'more': 'More Info',
  },
  'page': {
    'dashboard': {
      'title': 'Dashboard',
      'analysis': 'Analysis',
      'monitor': 'Monitor',
      'workspace': 'Work Space',
    },
  },
  'personalize': {
    'title': 'Personalize',
    'subTitle': 'Make it more like yours',
    'themes': 'Themes',
    'font': 'Font Size',
    'radius': 'Radius',
    'normal': 'normal',
    'medium': 'medium',
    'large': 'large',
    'deep-theme': 'deep-theme',
    'devui-dark-theme': 'devui-dark-theme',
    'infinity-theme': 'infinity-theme',
    'provence-theme': 'provence-theme',
    'sweet-theme': 'sweet-theme',
    'customize-theme': 'customize-theme',
  },
  'registerPage': {
    'coperation': 'DevUI Design Presented',
    'title': 'Register',
    'submit': 'Register',
    'email': 'Email',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    'other': 'Already have an account?',
    'resultMessage': {
      'title': 'Registration success',
      'content': 'Your account is successfully registered, and will return to the login page to log in.',
    },
  },
  'side-setting': {
    'layout': 'Change Layout',
    'fix-header': 'Fix Header',
    'fix-sidebar': 'Fix Sidebar',
    'content-area': 'Content Area Display',
    'hide-footer': 'Hide Footer',
    'hide-top': 'Hide Top',
    'hide-menu': 'Hide Menu',
    'hide-menu-head': 'Hide Menu Head',
    'notice':
      'The configuration bar only provides preview of dynamic layout switching in this site. You can manually copy and modify related configuration files and clear the localStorage cache.',
    'copy-config': 'Copy Config',
    'copy-summary': 'Copy Successfully',
    'copy-content':
      'Please modify config file in src/app/@shared/layouts/da-layout/default-layout.config.ts',
    'sidebar-notice': {
      'can-config': 'Choose weather to fix sidebar',
      'cannot-config': 'This config can only be used when there is a sidebar',
    },
    'helpContent':
      'We only show you the switch of different layouts here, see more info in our document.',
  },
};

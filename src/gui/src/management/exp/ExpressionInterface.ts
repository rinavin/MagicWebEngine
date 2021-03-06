export class ExpressionInterface {

  // General constants definitions

  static EXP_OPER_LEN: number = 2;
  static EXP_OPER_FUNC_PTR_LEN: number = 4;

  // expression operators
  static EXP_OP_NONE: number = 0;
  static EXP_OP_V: number = 1;
  static EXP_OP_VAR: number = 2;
  static EXP_OP_A: number = 3;
  static EXP_OP_H: number = 4;
  static EXP_OP_N: number = 5;
  static EXP_OP_D: number = 6;
  static EXP_OP_T: number = 7;
  static EXP_OP_L: number = 8;
  static EXP_OP_F: number = 9;
  static EXP_OP_K: number = 10;
  static EXP_OP_P: number = 11;
  static EXP_OP_M: number = 12;
  static EXP_OP_ACT: number = 13;
  static EXP_OP_KBD: number = 14;
  static EXP_OP_ADD: number = 15;
  static EXP_OP_SUB: number = 16;
  static EXP_OP_MUL: number = 17;
  static EXP_OP_DIV: number = 18;
  static EXP_OP_MOD: number = 19;
  static EXP_OP_NEG: number = 20;
  static EXP_OP_FIX: number = 21;
  static EXP_OP_ROUND: number = 22;
  static EXP_OP_EQ: number = 23;
  static EXP_OP_NE: number = 24;
  static EXP_OP_LE: number = 25;
  static EXP_OP_LT: number = 26;
  static EXP_OP_GE: number = 27;
  static EXP_OP_GT: number = 28;
  static EXP_OP_NOT: number = 29;
  static EXP_OP_OR: number = 30;
  static EXP_OP_AND: number = 31;
  static EXP_OP_IF: number = 32;
  static EXP_OP_LEN: number = 33;
  static EXP_OP_CON: number = 34;
  static EXP_OP_MID: number = 35;
  static EXP_OP_LEFT: number = 36;
  static EXP_OP_RIGHT: number = 37;
  static EXP_OP_FILL: number = 38;
  static EXP_OP_INSTR: number = 39;
  static EXP_OP_TRIM: number = 40;
  static EXP_OP_LTRIM: number = 41;
  static EXP_OP_RTRIM: number = 42;
  static EXP_OP_STR: number = 43;
  static EXP_OP_VAL: number = 44;
  static EXP_OP_STAT: number = 45;
  static EXP_OP_LEVEL: number = 46;
  static EXP_OP_COUNTER: number = 47;
  static EXP_OP_VARPREV: number = 48;
  static EXP_OP_VARCURR: number = 49;
  static EXP_OP_VARMOD: number = 50;
  static EXP_OP_VARINP: number = 51;
  static EXP_OP_VARNAME: number = 52;
  static EXP_OP_VIEWMOD: number = 53;
  static EXP_OP_ENV: number = 54;
  static EXP_OP_INIGET: number = 55;
  static EXP_OP_INIPUT: number = 56;
  static EXP_OP_USER: number = 57;
  static EXP_OP_TERM: number = 59;
  static EXP_OP_DATE: number = 61;
  static EXP_OP_TIME: number = 62;
  static EXP_OP_SYS: number = 63;
  static EXP_OP_MENU: number = 65;
  static EXP_OP_PROG: number = 66;
  static EXP_OP_PWR: number = 68;
  static EXP_OP_LOG: number = 69;
  static EXP_OP_EXP: number = 70;
  static EXP_OP_ABS: number = 71;
  static EXP_OP_SIN: number = 72;
  static EXP_OP_COS: number = 73;
  static EXP_OP_TAN: number = 74;
  static EXP_OP_ASIN: number = 75;
  static EXP_OP_ACOS: number = 76;
  static EXP_OP_ATAN: number = 77;
  static EXP_OP_RAND: number = 78;
  static EXP_OP_MIN: number = 79;
  static EXP_OP_MAX: number = 80;
  static EXP_OP_RANGE: number = 81;
  static EXP_OP_REP: number = 82;
  static EXP_OP_INS: number = 83;
  static EXP_OP_DEL: number = 84;
  static EXP_OP_FLIP: number = 85;
  static EXP_OP_UPPER: number = 86;
  static EXP_OP_LOWER: number = 87;
  static EXP_OP_CRC: number = 88;
  static EXP_OP_CHKDGT: number = 89;
  static EXP_OP_SOUNDX: number = 90;
  static EXP_OP_HSTR: number = 91;
  static EXP_OP_HVAL: number = 92;
  static EXP_OP_CHR: number = 93;
  static EXP_OP_ASC: number = 94;
  static EXP_OP_MSTR: number = 103;
  static EXP_OP_MVAL: number = 104;
  static EXP_OP_DSTR: number = 105;
  static EXP_OP_DVAL: number = 106;
  static EXP_OP_TSTR: number = 107;
  static EXP_OP_TVAL: number = 108;
  static EXP_OP_DAY: number = 109;
  static EXP_OP_MONTH: number = 110;
  static EXP_OP_YEAR: number = 111;
  static EXP_OP_DOW: number = 112;
  static EXP_OP_CDOW: number = 113;
  static EXP_OP_CMONTH: number = 114;
  static EXP_OP_NDOW: number = 115;
  static EXP_OP_NMONTH: number = 116;
  static EXP_OP_SECOND: number = 117;
  static EXP_OP_MINUTE: number = 118;
  static EXP_OP_HOUR: number = 119;
  static EXP_OP_DELAY: number = 120;
  static EXP_OP_IDLE: number = 121;
  static EXP_OP_KBPUT: number = 135;
  static EXP_OP_KBGET: number = 136;
  static EXP_OP_FLOW: number = 137;
  static EXP_OP_LOGICAL: number = 138;
  static EXP_OP_VISUAL: number = 139;
  static EXP_OP_ADDDATE: number = 156;
  static EXP_OP_ADDTIME: number = 157;
  static EXP_OP_OWNER: number = 158;
  static EXP_OP_VARATTR: number = 159;
  static EXP_OP_BOM: number = 160;
  static EXP_OP_BOY: number = 161;
  static EXP_OP_EOM: number = 162;
  static EXP_OP_EOY: number = 163;
  static EXP_OP_RIGHT_LITERAL: number = 165;
  static EXP_OP_RIGHTS: number = 166;
  static EXP_OP_ROLLBACK: number = 167;
  static EXP_OP_VARSET: number = 168;
  static EXP_OP_EVALX: number = 171;
  static EXP_OP_IGNORE: number = 172;
  static EXP_OP_NULL: number = 173;
  static EXP_OP_NULL_A: number = 174;
  static EXP_OP_NULL_N: number = 175;
  static EXP_OP_NULL_B: number = 176;
  static EXP_OP_NULL_D: number = 177;
  static EXP_OP_NULL_T: number = 178;
  static EXP_OP_ISNULL: number = 179;
  static EXP_OP_TDEPTH: number = 180;
  static EXP_OP_CLICKWX: number = 189;
  static EXP_OP_CLICKWY: number = 190;
  static EXP_OP_CLICKCX: number = 191;
  static EXP_OP_CLICKCY: number = 192;
  static EXP_OP_MINMAGIC: number = 193;
  static EXP_OP_MAXMAGIC: number = 194;
  static EXP_OP_RESMAGIC: number = 195;
  static EXP_OP_FILEDLG: number = 196;
  static EXP_OP_MLS_TRANS: number = 199;
  static EXP_OP_CTRL_NAME: number = 200;
  static EXP_OP_WIN_BOX: number = 201;
  static EXP_OP_WIN_HWND: number = 202;
  static EXP_OP_GETLANG: number = 206;
  static EXP_OP_CHECK_MENU: number = 207;
  static EXP_OP_ENABLE_MENU: number = 208;
  static EXP_OP_SHOW_MENU: number = 209;
  static EXP_OP_NULL_O: number = 210;
  static EXP_OP_GETPARAM: number = 212;
  static EXP_OP_SETPARAM: number = 213;
  static EXP_OP_CND_RANGE: number = 219;
  static EXP_OP_ISDEFAULT: number = 235;
  static EXP_OP_FORM: number = 236;
  static EXP_OP_STRTOKEN: number = 237;
  static EXP_OP_INIGETLN: number = 241;
  static EXP_OP_EXPCALC: number = 242;
  static EXP_OP_E: number = 243;
  static EXP_OP_CTRL_LEFT: number = 244;
  static EXP_OP_CTRL_TOP: number = 245;
  static EXP_OP_CTRL_LEFT_MDI: number = 246;
  static EXP_OP_CTRL_TOP_MDI: number = 247;
  static EXP_OP_CTRL_WIDTH: number = 248;
  static EXP_OP_CTRL_HEIGHT: number = 249;
  static EXP_OP_SETCRSR: number = 261;
  static EXP_OP_CTRLHWND: number = 263;
  static EXP_OP_LAST_CTRL_PARK: number = 264;
  static EXP_OP_WEB_REFERENCE: number = 267;
  static EXP_OP_CURRROW: number = 272;
  static EXP_OP_CASE: number = 273;
  static EXP_OP_LIKE: number = 275;
  static EXP_OP_CALLJS: number = 283;
  static EXP_OP_CALLOBJ: number = 284;
  static EXP_OP_THIS: number = 290;
  static EXP_OP_REPSTR: number = 303;
  static EXP_OP_EDITGET: number = 304;
  static EXP_OP_EDITSET: number = 305;
  static EXP_OP_DBROUND: number = 306;
  static EXP_OP_VARPIC: number = 307;
  static EXP_OP_STRTOK_CNT: number = 309;
  static EXP_OP_VARCURRN: number = 310;
  static EXP_OP_VARINDEX: number = 311;
  static EXP_OP_HAND_CTRL: number = 312;
  static EXP_OP_CLIPADD: number = 338;
  static EXP_OP_CLIPREAD: number = 340;
  static EXP_OP_CLIPWRITE: number = 339;
  static EXP_OP_JCDOW: number = 343;
  static EXP_OP_JMONTH: number = 344;
  static EXP_OP_JNDOW: number = 345;
  static EXP_OP_JYEAR: number = 346;
  static EXP_OP_JGENGO: number = 347;
  static EXP_OP_HAN: number = 350;
  static EXP_OP_ZEN: number = 351;
  static EXP_OP_ZENS: number = 352;
  static EXP_OP_ZIMEREAD: number = 353;
  static EXP_OP_ZKANA: number = 354;
  static EXP_OP_MENU_NAME: number = 363;
  static EXP_OP_GOTO_CTRL: number = 368;
  static EXP_OP_TRANSLATE: number = 373;
  static EXP_OP_ASTR: number = 374;
  static EXP_OP_CALLURL: number = 376;
  static EXP_OP_CALLPROGURL: number = 377;
  static EXP_OP_DRAG_SET_DATA: number = 380;
  static EXP_OP_DRAG_SET_CURSOR: number = 381;
  static EXP_OP_DROP_FORMAT: number = 382;
  static EXP_OP_GET_DROP_DATA: number = 383;
  static EXP_OP_LOOPCOUNTER: number = 401;
  static EXP_OP_DROP_GET_X: number = 413;
  static EXP_OP_DROP_GET_Y: number = 414;
  static EXP_OP_VECGET: number = 417;
  static EXP_OP_VECSET: number = 418;
  static EXP_OP_VECSIZE: number = 419;
  static EXP_OP_VECCELLATTR: number = 420;
  static EXP_OP_BLOBSIZE: number = 442;
  static EXP_OP_STRTOKEN_IDX: number = 448;
  static EXP_OP_MTIME: number = 449;
  static EXP_OP_MTVAL: number = 450;
  static EXP_OP_MTSTR: number = 451;
  static EXP_OP_WINHELP: number = 460;
  static EXP_OP_IN: number = 462;
  static EXP_OP_ISCOMPONENT: number = 465;
  static EXP_OP_RQRTTRMTIME: number = 468;
  static EXP_OP_DIRDLG: number = 471;
  static EXP_OP_EXT_A: number = 485;
  static EXP_OP_MARKTEXT: number = 472;
  static EXP_OP_MARKEDTEXTSET: number = 473;
  static EXP_OP_MARKEDTEXTGET: number = 474;
  static EXP_OP_CARETPOSGET: number = 475;
  static EXP_OP_NULL_U: number = 491;
  static EXP_OP_MNUADD: number = 492;
  static EXP_OP_MNUREMOVE: number = 493;
  static EXP_OP_MNURESET: number = 494;
  static EXP_OP_MNU: number = 495;
  static EXP_OP_USER_DEFINED_FUNC: number = 496;
  static EXP_OP_SUBFORM_EXEC_MODE: number = 497;
  static EXP_OP_UNICODEASC: number = 506;
  static EXP_OP_ADDDT: number = 509;
  static EXP_OP_DIFDT: number = 510;
  static EXP_OP_ISFIRSTRECORDCYCLE: number = 511;
  static EXP_OP_MAINLEVEL: number = 512;
  static EXP_OP_MAINDISPLAY: number = 515;
  static EXP_OP_SETWINDOW_FOCUS: number = 518;
  static EXP_OP_MENU_IDX: number = 519;
  static EXP_OP_DBVIEWSIZE: number = 539;
  static EXP_OP_DBVIEWROWIDX: number = 540;
  static EXP_OP_PROJECTDIR: number = 541;
  static EXP_OP_FORMSTATECLEAR: number = 542;
  static EXP_OP_PUBLICNAME: number = 543;
  static EXP_OP_TASKID: number = 544;
  static EXP_OP_STR_BUILD: number = 549;
  static EXP_OP_CLIENT_FILE2BLOB: number = 551;
  static EXP_OP_CLIENT_BLOB2FILE: number = 552;
  static EXP_OP_CLIENT_FILECOPY: number = 553;
  static EXP_OP_CLIENT_FILEDEL: number = 554;
  static EXP_OP_CLIENT_FILEEXIST: number = 555;
  static EXP_OP_CLIENT_FILE_LIST_GET: number = 556;
  static EXP_OP_CLIENT_FILEREN: number = 557;
  static EXP_OP_CLIENT_FILESIZE: number = 558;
  static EXP_OP_CLIENT_OS_ENV_GET: number = 559;
  static EXP_OP_CLIENT_OS_ENV_SET: number = 560;
  static EXP_OP_EMPTY_DATA_VIEW: number = 561;
  static EXP_OP_BROWSER_SET_CONTENT: number = 562;
  static EXP_OP_BROWSER_GET_CONTENT: number = 563;
  static EXP_OP_BROWSER_SCRIPT_EXECUTE: number = 564;
  static EXP_OP_CLIENT_GET_UNIQUE_MC_ID: number = 565;
  static EXP_OP_CTRL_CLIENT_CX: number = 566;
  static EXP_OP_CTRL_CLIENT_CY: number = 567;
  static EXP_OP_STATUSBARSETTEXT: number = 568;
  static EXP_OP_CLIENT_FILEINFO: number = 571;
  static EXP_OP_CLIENT_FILEOPEN_DLG: number = 572;
  static EXP_OP_CLIENT_FILESAVE_DLG: number = 573;
  static EXP_OP_CLIENT_DIRDLG: number = 574;
  static EXP_OP_CLIENT_REDIRECT: number = 577;
  static EXP_OP_IS_MOBILE_CLIENT: number = 593;
  static EXP_OP_CLIENT_SESSION_STATISTICS_GET: number = 594;
  static EXP_OP_DN_MEMBER: number = 595;
  static EXP_OP_DN_STATIC_MEMBER: number = 596;
  static EXP_OP_DN_METHOD: number = 597;
  static EXP_OP_DN_STATIC_METHOD: number = 598;
  static EXP_OP_DN_CTOR: number = 599;
  static EXP_OP_DN_ARRAY_CTOR: number = 600;
  static EXP_OP_DN_ARRAY_ELEMENT: number = 601;
  static EXP_OP_DN_INDEXER: number = 602;
  static EXP_OP_DN_PROP_GET: number = 603;
  static EXP_OP_DN_STATIC_PROP_GET: number = 604;
  static EXP_OP_DN_ENUM: number = 605;
  static EXP_OP_DN_CAST: number = 606;
  static EXP_OP_DN_REF: number = 607;
  static EXP_OP_DN_SET: number = 608;
  static EXP_OP_DNTYPE: number = 609;
  static EXP_OP_DN_EXCEPTION: number = 610;
  static EXP_OP_DN_EXCEPTION_OCCURED: number = 611;
  static EXP_OP_TASKTYPE: number = 612;
  static EXP_OP_SERVER_FILE_TO_CLIENT: number = 614;
  static EXP_OP_CLIENT_FILE_TO_SERVER: number = 615;
  static EXP_OP_RANGE_ADD: number = 616;
  static EXP_OP_RANGE_RESET: number = 617;
  static EXP_OP_LOCATE_ADD: number = 618;
  static EXP_OP_LOCATE_RESET: number = 619;
  static EXP_OP_SORT_ADD: number = 620;
  static EXP_OP_SORT_RESET: number = 621;
  static EXP_OP_TSK_INSTANCE: number = 622;
  static EXP_OP_DATAVIEW_TO_DN_DATATABLE: number = 625;
  static EXP_OP_CLIENTSESSION_SET: number = 632;
  static EXP_OP_UTCDATE: number = 633;
  static EXP_OP_UTCTIME: number = 634;
  static EXP_OP_UTCMTIME: number = 635;
  static EXP_OP_CLIENT_DB_DISCONNECT: number = 636;
  static EXP_OP_DATAVIEW_TO_DATASOURCE: number = 637;
  static EXP_OP_CLIENT_DB_DEL: number = 638;
  static EXP_OP_CLIENT_NATIVE_CODE_EXECUTION: number = 645;
  static EXP_OP_VARDISPLAYNAME: number = 647;
  static EXP_OP_CONTROLS_PERSISTENCY_CLEAR: number = 648;
  static EXP_OP_CONTROL_ITEMS_REFRESH: number = 649;
  static EXP_OP_VARCONTROLID: number = 650;
  static EXP_OP_CONTROLITEMSLIST: number = 651;
  static EXP_OP_CONTROLDISPLAYLIST: number = 652;
  static EXP_OP_CLIENT_SQL_EXECUTE: number = 653;
  static EXP_OP_PIXELSTOFROMUNITS: number = 654;
  static EXP_OP_FORMUNITSTOPIXELS: number = 655;
  static EXP_OP_CONTROL_SELECT_PROGRAM: number = 656;
  static EXP_OP_COLOR_SET: number = 659;
  static EXP_OP_FONT_SET: number = 660;

  constructor() {
  }
}

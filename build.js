/*entry file for building production CDN js file*/

/*	@ template (including vue)	*/
import '~/chunk/template';

/*
	@ Quill, text-editor.
	This part is very large (about 250KB).
	Excluding this part is recommanded if you're not using it. 
*/
//import '~/chunk/text-editor'

/*	@ ajax-handler	*/
import '~/chunk/ajax-handler';

/*	@ i18n	*/
import '~/chunk/i18n'

/*	@ log-system	*/
import '~/chunk/logsys'

/*	@ lazyLoad 		*/
import '~/chunk/lazy-load';

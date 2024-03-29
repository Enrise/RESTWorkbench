# Archived and unmaintained

This is an old repository that is no longer used or maintained. We advice to no longer use this repository.

## Original README can be found below:

Copy the Workbench module to your modules directory.
Copy the workbench.ini to your config folder.
Modify the config to suit your needs.
settings.workbench.baseUrl is a string from where the communication with the REST service should start.
Ex: settings.workbench.baseUrl = "http://api.autotrack.dev"

-settings.workbench.scanPaths[] is an array the should contain all the controller directories you want to have scanned for REST actions.
Ex: settings.workbench.scanPaths[] = "D:\www\4177-AutoTrack-API\application/modules/Cardata/Controller"

-settings.workbench.fileToClassStrip[] is an array of string searches for a str_replace, needed to convert filenames to classes. All values will be replaced with nothing.
Ex: settings.workbench.fileToClassStrip[] = "D:\www\4177-AutoTrack-API\application/modules"

-settings.workbench.additionalIncludes[] is an array of filenames that the workbench should include in case it can not be found by the autoloader.
Ex: -settings.workbench.additionalIncludes[] = "D:\www\4177-AutoTrack-API\library\Glitch\Controller\Action\Rest.php"

settings.workbench.layout.projectname can contain a customer/company name, defaults to Enrise in the main.phtml
Ex: settings.workbench.layout.projectname = "ATAPI Workbench"

settings.workbench.layout.css[] is an array of additional CSS files that need to be loaded for a custom look.
Ex: settings.workbench.layout.css[] = "/workbenchResources/css/enrise.css"

Add the following line to your application.ini:
resources.frontController.controllerDirectory.workbench = GLITCH_MODULES_PATH "/Workbench/Controller"

Copy the public/workbenchResoures folder to your public folder.

Open your workbench with http://<foo>.<bar>/workbench

Documentation details:

First piece till the first @<field> will be shown as extended documentation.
@hint: small descriptive text visible when the resource/collection is in listed style.
@disabled: disable the REST entrypoint so no communication will be possible. Documentation will still be available.
@param: <fieldname> <field description> <{optional}> <{example: 18489}>. By default each field is required unless the {optional} string is found.
@query: <fieldname> <field description> <{optional}> <{example: 18489}>. By default each field is required unless the {optional} string is found. Array notation is also supported.
@accept: the accept header the REST service accepts. If you have specific formats that you accept you can pass those along by using +@format at the end of the accept header
@format: Pipe | separated list of formats the REST service accepts.
@url: the full URL to the location where the resource/collection can be found. Dynamic fields can be inserted by using the @param fieldname in the url wrapped with {}. Ex supplier/{supplier_id}.
Querystring data will be appended to this URL
@filter: defines a RESTful filter instance, of type Glitch_Controller_Action_Rest_Annotation_ResourceFilter

Sample docblock

    /**
     * Fetch a single supplier from AutoTrack.nl
     * It may contain bulk data
     *
     * @hint Get a single supplier
     * @param supplier_id The supplier (aanbieder) id
     * @query consumer_id The consumer (afnemer) id
     * @query foo Lorum ipsum {optional}
     * @query bat[] Lorum ipsum {optional} //This becomes an array and can be duplicated
     * @query abc[from] Lorum ipsum {optional} //This becomes an assoc array and CANT be duplicated
     * @query abc[to] Lorum ipsum {optional} //This becomes an assoc array and CANT be duplicated
     * @accept application/vnd.autotrack.supplier+@format
     * @format xml|json
     * @url /cardata/supplier/{supplier_id}
     * @filter bar * A bar parameter description
     * @filter foo[] foo|bar|baz Fixed parameter values
     * @filter foo range(1,45) Fixed parameter values
     */
    public function resourceGetAction()
    {
        //do stuff
    }

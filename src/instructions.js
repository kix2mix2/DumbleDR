export const welcome = "<div class=\"text-block\">" +
                "<h1>Call for participants</h1>\n" +
                "\t\t\t\t\t\t\t    <p>\n" +
                "\t\t\t\t\t\t\t\t\tThe VISUS Research Centre at University of Stuttgart is looking for online participants\n" +
                "\t\t\t\t\t\t\t\t\tfor a visualization and analysis study. </p>\n" +
                "                                 <p>\n" +
                "                                    We are applying algorithms that find similarities in images on a series of datasets and want to find out whether humans find the results good or bad.</p>\n" +
                "                                <p>\n" +
                "                                    The study consists of:\n" +
                "                                    <ul>\n" +
                "                                        <li>informed consent agreement,</li>\n" +
                "                                        <li>instructions for the task,</li>\n" +
                "                                        <li>a pre-participation survey that will assess your experience with this type of task,</li>\n" +
                "                                        <li>a series of trials where you are asked to analyse some scatterplots depicting the results of some Machine Learning algorithms and choose the best result.</li>\n" +
                "                                        <li>a post-trial survey, where we will ask you for feedback on the task.</li>\n" +
                "                                    </ul>\n" +
                "                                </p>\n" +
                "\n" +
                "                                <p>\n" +
                "                                    The requirements are:\n" +
                "                                    <ul>\n" +
                "                                        <li> You are at least 18 years old.</li>\n" +
                "                                        <li> You speak fluent English.</li>\n" +
                "                                        <li> Your screen-size is at least 800x600 pixels.</li>\n" +
                "                                        <li> You have some experience with data analysis tasks (e.g. analysing charts and extracting information from them).</li>\n" +
                "                                    </ul>\n" +
                "\n" +
                "                                </p>\n" +
                "\n" +
                "                                <p>\n" +
                "                                    The task is estimated to take between 30 minutes and 1 hour.\n" +
                "\n" +
                "                                </p>" +
    "<p>The study only works in <b>Chrome</b> or <b>Firefox</b>.</p>" +
                "<p>Press start to begin.</p></div>";



export const consent_form = "<div class=\"text-block\"><h1>We need your consent to proceed</h1>\n" +
                "                <hr>\n" +
                "                <div class=\"legal well\">\n" +
                "                    <p> Dear prospective participant, </p>\n" +
                "                    <p>\n" +
                "                        We would like to invite you to participate in the following study within the scope of the\n" +
                "                        research carried out at the Collaborative Research Center/Transregio 161 (SFB-TRR 161). </p>\n" +
                "                     <p>\n" +
                "                        In particular, we analyze the perception humans have of the results of various algorithms that seek to imitate human perception of similarity.\n" +
                "                    </p>\n" +
                "                    <p>\n" +
                "                        In the current study, „Evaluation of Dimensionality Reduction\n" +
                "                        Techniques for Image-based Data“, you will be required to analyse and select preferences\n" +
                "                        for a series of visualizations of algorithms applied on image data.\n" +
                "                    </p>\n" +
                "                    <p>\n" +
                "                        Detailed instructions will follow after this screen.\n" +
                "                    </p>\n" +
                "\n" +
                "                    <p>\n" +
                "                        <iframe src=\"./Consent.pdf\" style=\"width:80%; height:600px;\"\n" +
                "                            frameborder=\"0\"></iframe>\n" +
                "                    </p>\n" +
                "\n" +
                "                    <p>\n" +
                "                       By clicking 'I accept!', you are giving your informed consent to participate in this study. " +
                "                    </p>\n" +
                "                </div> <\div>";


export const dr_explain  = "<div class=\"text-block\"> \n" +
            "\n" +
            "<h1>Dimensionality reduction on image-based datasets</h1>\n" +
            "<p>\n" +
            "This experiment aims at gathering data about what users consider to be “good” or “”bad/misleading” visualizations. \n" +
            "More specifically we are interested in finding out user preferences regarding <b>projections of dimensionality reduction algorithms</b>. \n" +
            "</p>\n" +
            "<br>\n" +
            "\n" +
            "<h3>What is Dimensionality Reduction?</h3>\n" +
            "<p>\n" +
            "Dimensionality reduction (DR) refers to algorithms that reduce the number of dimensions (features) in a dataset, with minimal information loss. In this study, the dataset consists of images, and the DR projection result is a set of 2D coordinates, one for each image. This result can be visualized in a scatterplot, where each point represents an image from the dataset. Below you can see an example. \n" +
            "</p>\n" +
            "<img class='instructions' src='./dr_example.png'>\n" +
            "<p>\n" +
            "A good DR technique reduces data by maintaining similarity between items. This means that if two images are very similar they should be plot close to each other. Different DR algorithms define similarity differently, and for this reason we have many different scatterplots with different DR results. \n" +
            "</p>\n" +
            "\n" +
            "<p>In this study, we want you to analyse a group of scatterplots depicting these projections and decide which ones are good, and which ones are bad. <b>You do not need to have any additional knowledge about DR!</b></p>\n" +
            "\n" +
            "<p>In the next page we will explain the user interface of the study.</p>\n" +
            "\n" +
            "</div>";


export const ui = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<p>\n" +
                "We will rate your preferences on a dataset-by-dataset basis. Below you can see an example of what this dataset might be and how the interface looks like. In this case, the dataset consists of photographs of the same head captured from different angles. There are 8 scatterplots, each corresponding to a projection of a DR algorithm technique. \n" +
                "</p>\n" +
                "<br>\n" +
                "<img class='instructions' src='./grid_example.png'>\n" +
                "\n" +
                "<h3>Think of this as a game with the following rules:</h3>\n" +
                "</div>";

export const rule_1 = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 1:</h3>\n" +
                "\n" +
                "<p>Your job is to distribute 15 hearts/points across the 8 projections. You do not need to distribute all the hearts. </p>\n" +
                 "<h3>Rule 2:</h3>\n" +
                "<p>Some projections might be bad (i.e. where points can be randomly scattered), or misleading (i.e. clusters forming when there should no be clusters), or they might have other issues that you identify.  If this is the case, please mark the projections as bad by selecting the crossed heart symbol. You may leave a comment to any scatterplot, good or bad, by clicking the text box.</p>\n" +
                "<video class = 'instructions' controls>\n" +
                "  <source src=\"./rule_12.webm\" type=\"video/webm\">\n" +
                "Your browser does not support the video tag. \n" +
                "</video>" +
                "</div>";

export const rule_3 = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 3:</h3>\n" +
                "\n" +
               "<p>Each scatterplot can be enlarged for better analysis! You can also zoom in and hover over the points. If you want you may even leave a comment. </p>\n" +
                "<video class = 'instructions' controls>\n" +
                "  <source src=\"./rule_3.webm\" type=\"video/webm\">\n" +
                "Your browser does not support the video tag. \n" +
                "</video>" +
                "</div>";

export const sort = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 4:</h3>\n" +
                "\n" +
               "<p>After each rating, we recommend you to click the sort button, which will sort the scatterplots by your rating. We want you to really compare the projections and rate or re-rate so that the sorted list is arranged from best to worst. This is also the reason why you have a limited number of hearts to assign: we want to avoid someone rating everything 4-stars or everything with one stars. </p>\n" +
                 "<video class = 'instructions' controls>\n" +
                "  <source src=\"./sort.webm\" type=\"video/webm\">\n" +
                "Your browser does not support the video tag. \n" +
                "</video>" +
                "</div>";


export const color = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Final thing:</h3>\n" +
                "\n" +
                "<p>We have also implemented an additional view where we plot each image as a point. " +
    "The points are color coded by class labels. " +
    "This is an auxiliery view you may use to consolite your opinion of the projection. " +
    "We do however advise you should make your decision based on the image view, as class labels might not always make sense. </p>\n" +
                 "<video class = 'instructions' controls>\n" +
                "  <source src=\"./color.webm\" type=\"video/webm\">\n" +
                "Your browser does not support the video tag. \n" +
                "</video>" +

                "</div>";





export const time_text = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>How long will this take?</h1>\n" +
                "<p> In total we have 10 datasets, consisting of collections of photos. " +
                "After each trial you will be asked if you want to look at <b>Another Dataset</b> or <b>Finish the Experiment</b>. Therefore, the time it takes for the study will vary depending on how many trials you will do.</p> " +
                "<p>If you say no, you will be directed to the final debrief questionairre. </p>"+
                "<p>However, it would be really nice if you solve 5 or more! in any case, we promise beer and/or chocolate for your help! </p>" +
                "<video class = 'instructions' controls>\n" +
                "  <source src=\"./next.webm\" type=\"video/webm\">\n" +
                "Your browser does not support the video tag. \n" +
                "</video>" +

                "<p>Instructions are over, once you proceed you cannot return to them!</p>" +
                "</div>";

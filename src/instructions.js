export const welcome = "<div class=\"text-block\">" +
                "<h1>Call for participants</h1>\n" +
                "<img src=\"./images/visus.png\" height = '100px'> <img src=\"./images/logo-precise.png\" height = '100px'>"+
                "\t\t\t\t\t\t\t    <p>\n" +
                "\t\t\t\t\t\t\t\t\tThe <b>Visualization Research Center (VISUS)</b> at the University of Stuttgart and the <b>Research Center on Information Systems Engineering (PReCISE)</b> from the University of Namur are looking for participants for an\n" +
                "\t\t\t\t\t\t\t\t\tonline study on visualization and visual analysis. </p>\n" +
                "                                 <p>\n" +
                "                                    Given a series of datasets, we apply algorithms that find similarities in images.\n" +
    "We want to find out whether humans consider the resulting visualizations to be good or bad.</p>\n" +
                "                                <p>\n" +
                "                                    The study consists of:\n" +
                "                                    <ul>\n" +
                "                                        <li>An informed consent agreement;</li>\n" +
                "                                        <li>Instructions for the task;</li>\n" +
                "                                        <li>A pre-participation survey that will assess your experience with this type of task;</li>\n" +
                "                                        <li>A series of trials where you are asked to analyze scatterplots depicting the results of some machine learning algorithms and choose the best result;</li>\n" +
                "                                        <li>A post-trial survey, where we will ask you for feedback on the task.</li>\n" +
                "                                    </ul>\n" +
                "                                </p>\n" +
                "\n" +
                "                                <p>\n" +
                "                                    The requirements are:\n" +
                "                                    <ul>\n" +
                "                                        <li> You are at least 18 years old;</li>\n" +
                "                                        <li> You speak fluent English;</li>\n" +
                "                                        <li> Your screen-size is at least 700x400 pixels;</li>\n" +
                "                                        <li> You have some experience with data analysis tasks (e.g. analyzing charts and extracting information from them).</li>\n" +
                "                                    </ul>\n" +
                "\n" +
                "                                </p>\n" +
                "\n" +
                "                                <p>\n" +
                "                                    The task takes between 30 and 60 minutes.\n" +
                "\n" +
                "                                </p>" +
    "<p>The study only works in <b>Google Chrome</b> and <b>Mozilla Firefox</b>.</p>" +
                "<p>Press start to begin.</p></div>";



export const consent_form = "<div class=\"text-block\"><h1>We need your consent to proceed</h1>\n" +
                "                <hr>\n" +
                "                <div class=\"legal well\">\n" +
                "                    <p>Dear prospective participant, </p>\n" +
                "                    <p>\n" +
                "                        We would like to invite you to participate in the following study within the scope of the\n" +
                "                        research carried out at the Collaborative Research Center/Transregio 161 (SFB-TRR 161). </p>\n" +
                "                     <p>\n" +
                "                        In particular, we analyze the human perception of the results from various algorithms that seek to imitate human perception of visualizations.\n" +
                "                    </p>\n" +
                "                    <p>\n" +
                "                        In the current study, „Evaluation of Dimensionality Reduction\n" +
                "                        Techniques for Image-based Data“, you will be required to analyze and select preferences\n" +
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
            "<h1>Dimensionality Reduction on Image-based Datasets</h1>\n" +
            "<p>\n" +
            "This experiment aims at gathering data about what users consider to be “good” or ”bad/misleading” visualizations. \n" +
            "More specifically we are interested in finding out user preferences regarding <b>projections of dimensionality reduction algorithms</b>. \n" +
            "</p>\n" +
            "<br>\n" +
            "\n" +
            "<h3>What is Dimensionality Reduction?</h3>\n" +
            "<p>\n" +
            "Dimensionality reduction (DR) refers to algorithms that reduce the number of dimensions (features) in a dataset, with minimal information loss. In this study, the dataset consists of images, and the DR projection result is a set of 2D coordinates, one for each image. This result can be visualized in a scatterplot, where each point represents an image from the dataset. Below you can see an example. \n" +
            "</p>\n" +
            "<img class='instructions' src='./images/dr_example.png'>\n" +
            "<p>\n" +
            "A good DR technique reduces data by maintaining similarity between items. This means that if two images are very similar they should be plotted close to each other, and far from each other if they are dissimilar. Different DR algorithms define similarity differently and thereore produce different scatterplots. \n" +
            "</p>\n" +
            "\n" +
            "<p>In this study, we want you to analyze a group of scatterplots depicting these projections and decide which ones are good and which are bad. <b>You do not need to have any additional knowledge about DR!</b></p>\n" +
            "\n" +
            "<p>On the next page we will explain the user interface of the study.</p>\n" +
            "\n" +
            "</div>";


export const ui = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<p>\n" +
                "We will rate your preferences on a dataset-by-dataset basis. Below you can see an example of what this dataset might be and what the interface looks like. In this case, the dataset consists of photographs of the same head captured from different angles. There are 8 scatterplots, each corresponding to a projection of a DR algorithm technique. \n" +
                "</p>\n" +
                "<br>\n" +
                "<img class='instructions' src='./images/grid_example.png'>\n" +
                "\n" +

                "</div>";

export const rule_1 = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Think of this as a game with the following rules:</h3>\n" +
                "<h3>Rule 1:</h3>\n" +
                "\n" +
                "<p>Your job is to distribute 15 hearts/points across the 8 projections. You do not need to distribute all the hearts. </p>\n" +
                 "<h3>Rule 2:</h3>\n" +
                "<p>Some projections might be bad (e.g. if points are randomly scattered), or misleading (e.g. clusters forming when there should be none), or they might have other issues that you identify. If this is the case, please mark the projections as bad by selecting the crossed heart symbol. You may leave a comment for any scatterplot, good or bad, by clicking the text box.</p>\n" +
                "<video class = 'instructions' controls  autoplay loop>\n" +
                "  <source src=\"./images/rule_12.webm\" type=\"video/webm\">\n" +
                "Your browser does not support the video tag. \n" +
                "</video>" +
                "</div>";

export const rule_3 = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 3:</h3>\n" +
                "\n" +
               "<p>Each scatterplot can be enlarged for better analysis! You can also zoom in and hover over the points. If you want you may even leave a comment. </p>\n" +
                "<p><b>We highly recommend you to use this feature!</b></p>"+
                "<video class = 'instructions' controls autoplay loop>\n" +
                "  <source src=\"./images/rule_3.webm\" type=\"video/webm\">\n" +
                "Your browser does not support the video tag. \n" +
                "</video>" +
                "</div>";

export const sort = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 4:</h3>\n" +
                "\n" +
               "<p>After each rating, we recommend you to click the sort button, which will sort the scatterplots by your rating. We want you to really compare the projections and rate or re-rate so that the sorted list is arranged from best to worst. This is also the reason why you have a limited number of hearts to assign: we want to mostly avoid someone rating everything 4-stars. </p>\n" +
                 "<video class = 'instructions' controls autoplay loop>\n" +
                "  <source src=\"./images/sort.webm\" type=\"video/webm\">\n" +
                "Your browser does not support the video tag. \n" +
                "</video>" +
                "</div>";


export const color = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Final thing:</h3>\n" +
                "\n" +
                "<p>We also implemented an additional view where we plot each image as a point. " +
    "The points are color coded by class labels. " +
    "This is an auxiliary view you may use to consolidate your opinion of the projection. " +
    "You should make your decision based on the image view, as class labels might not always make sense. </p>\n" +
                 "<video class = 'instructions' controls autoplay loop>\n" +
                "  <source src=\"./images/color.webm\" type=\"video/webm\">\n" +
                "Your browser does not support the video tag. \n" +
                "</video>" +

                "</div>";





export const time_text = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>How long will this take?</h1>\n" +
                "<p> In total we have 12 datasets, consisting of collections of photos. " +
                "After each trial, you will be asked if you want to look at <b>Another Dataset</b> or <b>Finish the Experiment</b>. If you choose the latter, you will be directed to the final debriefing questionnaire." +
    "The time it takes for the study will depend on how many trials you do. <b>It took us about 40 minutes to rate all datasets.</b></p> " +
                "<p>It would be really nice if you solved at least 5! We promise beer and/or chocolate for your help! </p>" +
    "<p>You might receive the same dataset twice. In this case just re-do it. This is so we assess your consistency. </p>" +


                "<p>Instructions are over, once you proceed you cannot return to them!</p>" +
                "</div>";


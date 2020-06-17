


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
                "<img class='instructions' src='./rule_1.gif'>" +
                "</div>";

export const rule_3 = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 3:</h3>\n" +
                "\n" +
               "<p>Each scatterplot can be enlarged for better analysis! You can also zoom in and hover over the points.</p>\n" +
                "<img class='instructions' src='./rule_3.gif'>" +
                "</div>";

export const sort = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Rule 4:</h3>\n" +
                "\n" +
               "<p>After each rating, we recommend you to click the sort button, which will sort the scatterplots by your rating. We want you to really compare the projections and rate or re-rate so that the sorted list is arranged from best to worst. This is also the reason why you have a limited number of hearts to assign: we want to avoid someone rating everything 4-stars or everything with one stars. </p>\n" +
                 "<img class='instructions' src='./sort.gif'>" +
                "</div>";


export const color = "<div class=\"text-block\"> \n" +
                "\n" +
                "<h1>User Interface</h1>\n" +
                "<h3>Final thing:</h3>\n" +
                "\n" +
                "<p>We have also implemented an additional view where we plot each image as a point. The points are color coded by class labels. This is an auxiliery view you may use to consolite your opinion of the projection. We do however advise you should make your decision based on the image view, as class labels might not always make sense. </p>\n" +
                 "<img class='instructions' src='./color_view.gif'>" +
                "</div>";



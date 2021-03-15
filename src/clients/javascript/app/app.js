function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomNumberExcluding(min, max, exclude) {
    while (true) {
        var rnd = Math.floor(Math.random() * (max - min) + min);
        if (exclude.length == 0 || exclude.indexOf(rnd) === -1) {
            return rnd;
        }
    }

  return Math.floor(Math.random() * (max - min) + min);
}

function handleAnswer(term, answer, correct_answer) {
    if (correct_answer === null) {
        term.echo('Game has not started.');
    } else if (answer === correct_answer) {
        state_correct++;
        state_total++;
        term.echo(box_top + box_cor + box_btm);
        // TODO: add correct streak
    } else {
        state_incorrect++;
        state_total++;
        term.echo(box_top + box_wro + box_btm);
        term.echo('The correct answer was (' + correct_answer_display  + ')');
    }

    term.echo('Your score: ' + state_correct + '/' + state_total);
    term.echo('');

//    term.echo("DEBUG:");
//    term.echo('answer =          ' + answer);
//    term.echo('correct_answer =  ' + correct_answer);
//    term.echo('state_correct =   ' + state_correct);
//    term.echo('state_incorrect = ' + state_incorrect);
//    term.echo('state_total =     ' + state_total);
}

function _color(c) {
    return "[[;" + c + ";]"
}

function color_() {
    return "]";
}

var version = "Cloud Jeopardy v0.0.1";
var qna_data = null;
var qna_data_count = 0;
var data_ready = false;
var config_spinner_name = 'dots';
var config_prompt = 'A, B or C? > ';

var correct_answer = null;
var correct_answer_display = null;
var state_product = null;
var state_products = ["s3", "ecr", "ecs", "ec2", "elasticache", "rds", "elasticmapreduce", "route53",
                        "lambda", "sagemaker", "sagemakergroundtruth", "sns", "sqs", "vpc", "kinesis",
                        "directconnect", "cloudwatch", "cloudfront", "iam", "redshift", "athena", "efs",
                        "glue", "rdsaurora", "iot-core", "systems-manager", "eks", "cognito", "dynamodb"];
var state_correct = 0;
var state_incorrect = 0;
var state_total = 0;

var box_top = "┌────────────────────────────────┐\n";
var box_ans = "│ Given the answer:              │\n";
var box_qns = "│ What was the question?         │\n";
var box_cor = "│ [[;white;]✓] Correct! You legend.         │\n";
var box_wro = "│ [[;red;]𐄂] Wrong, sorry.                │\n";
var box_btm = "└────────────────────────────────┘";

function playJeopardy(term, products, stopSpinningFn) {
    data_ready = false;

    product_idx = randomNumber(0, products.length);
    product = products[product_idx];
    data_url = "https://prd-s3-cloud-jeopardy-api.s3.amazonaws.com/faqs/" + product + "-faq.json";

    $.ajax({
      type: "GET",
      url: data_url,
      cache: false,
      success: function(data) {
        stopSpinningFn(term);

        qna_data = data["qnas"];
        qna_data_count = Object.keys(qna_data).length;
        data_ready = true;

        var idx1 = randomNumberExcluding(0, qna_data_count, []);
        var idx2 = randomNumberExcluding(0, qna_data_count, [idx1]);
        var idx3 = randomNumberExcluding(0, qna_data_count, [idx1, idx2]);

        var selected_qnas = [
            qna_data[idx1],
            qna_data[idx2],
            qna_data[idx3]
        ]

        correct_answer = randomNumber(0,3);
        correct_answer_display = ["A", "B", "C"][correct_answer];

        // Display answer box
        var box_ans_custom = "│ Given the " + product + " answer: ";
        for (i=box_ans_custom.length; i<box_top.length-2; i++) {
            box_ans_custom = box_ans_custom + " ";
        }
        box_ans_custom = box_ans_custom + "│\n";
        var box_top_custom = "┌";
        for (i=0; i<box_ans_custom.length-3; i++) {
            box_top_custom = box_top_custom + "─";
        }
        box_top_custom = box_top_custom + "┐\n";
        box_btm_custom = box_top_custom.replace("┌", "└").replace("┐", "┘").replace("\n", "");

        term.echo(box_top_custom + box_ans_custom + box_btm_custom);

        // Display answer text
        term.echo(_color("#ccc") + selected_qnas[correct_answer]["answer"] + color_());

        // Display options
        term.echo("");
        term.echo(box_top + box_qns + box_btm);
        term.echo(_color("#ccc") + "(A) " + selected_qnas[0]["question"] + color_() + "\n");
        term.echo(_color("#ccc") + "(B) " + selected_qnas[1]["question"] + color_() + "\n");
        term.echo(_color("#ccc") + "(C) " + selected_qnas[2]["question"] + color_() + "\n");
      },
      error: function(data) {
        console.log('ajax error');
        console.log(data);
        stopSpinningFn(term);
        term.echo("Sorry, my bad :( Ajax error: " + data.status + " " + data.statusText + " for url: " + data_url);
      },
    });
}

$(function($, undefined) {
    var spinners_url = 'spinners.json';
    $.getJSON(spinners_url, function(spinners) {
        var animation = false;
        var timer;
        var prompt;
        var i;
        var spinner = spinners[config_spinner_name];

        function start(term, spinner) {
            animation = true;
            i = 0;
            function set() {
                var text = spinner.frames[i++ % spinner.frames.length];
                term.set_prompt(text);
            };
            prompt = term.get_prompt();
            term.find('.cursor').hide();
            set();
            timer = setInterval(set, spinner.interval);
        }

        function stop(term) {
            setTimeout(function() {
                clearInterval(timer);
                term.set_prompt(prompt);
                animation = false;
                term.find('.cursor').show();
            }, 0);
        }

        $(function() {
            // state_product = "ecr";  // TODO: make array and select sensible set.
            var term = $.terminal.active()
            start(term, spinner);
            playJeopardy(term, state_products, stop);
        });

        $('body').terminal({
            help: function() {
                this.echo('Try typing "play ec2", or "play ec" and then hitting tab twice to autocomplete.');
            },
            version: function() {
                this.echo(version);
            },
            a: function() {
                handleAnswer(this, 0, correct_answer);
                start(this, spinner);
                playJeopardy(this, state_products, stop);
            },
            A: function() {
                handleAnswer(this, 0, correct_answer);
                start(this, spinner);
                playJeopardy(this, state_products, stop);
            },
            b: function() {
                handleAnswer(this, 1, correct_answer);
                start(this, spinner);
                playJeopardy(this, state_products, stop);
            },
            B: function() {
                handleAnswer(this, 1, correct_answer);
                start(this, spinner);
                playJeopardy(this, state_products, stop);
            },
            c: function() {
                handleAnswer(this, 2, correct_answer);
                start(this, spinner);
                playJeopardy(this, state_products, stop);
            },
            C: function() {
                handleAnswer(this, 2, correct_answer);
                start(this, spinner);
                playJeopardy(this, state_products, stop);
            },
            play: function(product) {
                state_products = [product];
                start(this, spinner);
                playJeopardy(this, state_products, stop);
            }
        }, {
            name: 'cloud_jeopardy',
            prompt: config_prompt,
            greetings: 'Welcome to Cloud Jeopardy!\n\n' +
                'An AWS Certification study tool - select the correct question for the given AWS FAQ answer, Jeopardy style.\n',
            scrollOnEcho: true,
            completion: function(command, callback) {
                var utils = ['help', 'status', 'play', 'version'];
                var products = ['amazon-mq','amplify','api-gateway','app-mesh','app2container','appflow','application-discovery','appstream2','appsync','athena','audit-manager','augmented-ai','autoscaling','aws-transfer-family','backup','batch','braket','cdk','certificate-manager','chatbot','chime','cloud9','cloudformation','cloudfront','cloudhsm','cloudsearch','cloudshell','cloudtrail','cloudwatch','codebuild','codecommit','codedeploy','codeguru','codepipeline','codestar','cognito','comprehend','compute-optimizer','config','connect','console','consolemobile','containerscopilot','corretto','datapipeline','datasync','deepcomposer','deeplens','deepracer','detective','device-farm','devops-guru','directconnect','directoryservice','dms','documentdb','dynamodb','ebs','ec2','ec2autoscaling','ecr','ecs','efs','eks','ekseks-anywhere','ekseks-distro','elasticache','elasticbeanstalk','elasticloadbalancing','elasticmapreduce','elasticsearch-service','elastictranscoder','eventbridge','fargate','fis','forecast','fraud-detector','freertos','fsxlustre','fsxwindows','gamelift','global-accelerator','glue','grafana','ground-station','guardduty','iam','iot-analytics','iot-core','iot-device-defender','iot-device-management','iot-events','iot-sitewise','iot-things-graph','kendra','keyspaces','kinesis','kinesisvideo-streams','kms','lake-formation','lambda','lex','license-manager','lightsail','location','lookout-for-equipment','lookout-for-metrics','lookout-for-vision','lumberyard','machine-learningcontainers','macie','managed-blockchain','managed-workflows-for-apache-airflow','migration-evaluator','migration-hub','monitron','msk','neptune','network-firewall','opsworks','organizations','otel','outposts','panorama','personalize','pinpoint','polly','privatelink','prometheus','proton','qldb','quicksight','ram','rds','rdsaurora','rdsvmware','redshift','rekognition','robomaker','route53','s3','sagemaker','sagemakergroundtruth','security-hub','server-migration-service','servicecatalog','ses','shield','snow','sns','sqs','step-functions','storagegateway','sumerian','systems-manager','textract','timestream','transcribe','transit-gateway','translate','vpc','well-architected-tool','workdocs','worklink','workmail','workspaces','xray'];
                callback([].concat(utils, products));
            },
            keydown: function(e) {
                //disable keyboard when animating
                if (animation) {
                    return false;
                }
            }
        });

    });
});
var version = "Cloud Jeopardy v0.0.3";
var qna_data = null;
var qna_data_count = 0;
var data_ready = false;
var config_spinner_name = 'dots';
var config_prompt = 'A, B or C? > ';
var config_prompt_paused = '[press any key]';
var config_prompt_products = 'Select a product set to learn:';

var correct_answer = null;
var correct_answer_display = null;
var state_product = null;
var state_product_name = null;
var state_product_href = null;
var state_products = ["s3", "ecr", "ecs", "ec2", "elasticache", "rds", "elasticmapreduce", "route53",
                        "lambda", "sagemaker", "sagemakergroundtruth", "sns", "sqs", "vpc", "kinesis",
                        "directconnect", "cloudwatch", "cloudfront", "iam", "redshift", "athena", "efs",
                        "glue", "rdsaurora", "iot-core", "systems-manager", "eks", "cognito", "dynamodb"];

var state_product_sets = {
    "all": ["athena", "cloudfront", "cloudwatch", "cognito", "dynamodb","ec2", "ecr", "ecs", "efs","glue", "eks", "elasticache", "elasticmapreduce", "iam", "iot-core", "kinesis","directconnect", "rds", "rdsaurora", "redshift", "route53","lambda", "s3", "sagemaker", "sagemakergroundtruth", "sns", "sqs", "systems-manager", "vpc"],
    "core": ["cloudfront", "cloudwatch", "directconnect", "ec2", "efs", "iam", "lambda", "route53", "s3", "systems-manager", "vpc"],
    "data": ["dynamodb", "glue", "elasticache", "elasticmapreduce", "kinesis", "rds", "rdsaurora", "redshift", "s3"],
    "ml": ["sagemaker", "sagemakergroundtruth"]
}

var state_correct = 0;
var state_incorrect = 0;
var state_total = 0;
var state_qnas = [];

var box_top = "┌────────────────────────────────┐\n";
var box_qns = "│ What was the question?         │\n";
var box_btm = "└────────────────────────────────┘";


function handleAnswer(term, answer, correct_answer) {
    if (correct_answer === null) {
        term.echo('Game has not started.');
    } else if (answer === correct_answer) {
        state_correct++;
        state_total++;
        term.echo('[[;green;]✓] Correct! You legend.');
    } else {
        state_incorrect++;
        state_total++;
        term.echo('[[;red;]𐄂] Wrong, answer was ' + correct_answer_display);
        term.echo(state_product_name + ' docs: ' + state_product_href);
    }
    term.echo('Score: ' + state_correct + ' / ' + state_total);
    term.echo('');

    term.set_prompt(config_prompt_paused);
    scroll_to_bottom();
}

function _color(c) {
    return "[[;" + c + ";]"
}

function color_() {
    return "]";
}

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

        state_product_name = data["product_name"];
        state_product_href = data["product_href"];

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
        var box_ans_custom = "│ " + (state_total+1) + ". " + state_product_name + " answer: ";

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

        // Display question text options
        term.echo("");
        term.echo(box_top + box_qns + box_btm);
        term.echo(_color("#ccc") + "A. " + selected_qnas[0]["question"] + color_() + "\n");
        term.echo(_color("#ccc") + "B. " + selected_qnas[1]["question"] + color_() + "\n");
        term.echo(_color("#ccc") + "C. " + selected_qnas[2]["question"] + color_() + "\n");

        state_qnas.push(selected_qnas[correct_answer]["hash"]);
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
        var mode = 'select_products'; // select_products, wait_for_key, playing
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
                term.set_prompt(config_prompt);
                animation = false;
                term.find('.cursor').show();
            }, 0);
        }

        var greeting = 'Welcome to Cloud Jeopardy!\n\n' +
                       'An AWS Certification study tool - select the correct question for the given AWS FAQ answer, Jeopardy style.\n\n' +
                       'Source available here: https://github.com/dylanhogg/cloud-jeopardy-app\n\n';

        greeting += 'Which product set to play? TODO: this is in progress...\n';
        var i = 0;
        var alpha_list = ['A', 'B', 'C', 'D', 'E', 'F']; // TODO: more and common
        for (var key in state_product_sets) {
            greeting += alpha_list[i] + ': ' + key + '\n';
            i += 1;
        }

        $('body').terminal(
        function(line) {
            arr = line.trim().toLowerCase().replace(/\s\s+/g, " ").split(" ");
            cmd = arr[0];
            args = arr.slice(1);

            if (cmd == 'a' || cmd == '1') {
                handleAnswer(this, 0, correct_answer);
                mode = 'wait_for_key';
            }
            else if (cmd == 'b' || cmd == '2') {
                handleAnswer(this, 1, correct_answer);
                mode = 'wait_for_key';
            }
            else if (cmd == 'c' || cmd == '1') {
                handleAnswer(this, 2, correct_answer);
                mode = 'wait_for_key';
            }
            else if (cmd == 'play') {
                if (args.length === 0) {
                    this.echo('Usage is play <product>; Try "play ec" and then hit tab twice for autocomplete.');
                } else {
                    product = args[0];
                    state_products = [product];
                    start(this, spinner);
                    playJeopardy(this, state_products, stop);
                }
            }
            else if (cmd == 'help') {
                this.echo('Better help coming soon...:');
                this.echo('  play <product> - Only show <product> questions; Try "play ec" and then hit tab twice for autocomplete.');
                this.echo('  about - About this app.');
                this.echo('  help - This message.');
            }
            else if (cmd == 'about' || cmd == 'credits') {
                this.echo('For source code and all about this app see: https://github.com/dylanhogg/cloud-jeopardy-app');
            }
            else if (cmd == '') {
                // pass
                scroll_to_bottom();
            }
            else {
                this.echo('Unknown command: ' + cmd);
            }
        },
        {
            name: 'cloud_jeopardy',
            prompt: config_prompt_products,
            greetings: greeting,
            scrollOnEcho: true,
            completion: function(command, callback) {
                var utils = ['help', 'status', 'play', 'version'];
                // TODO: review this full list, where used?
                var products = ['amazon-mq','amplify','api-gateway','app-mesh','app2container','appflow','application-discovery','appstream2','appsync','athena','audit-manager','augmented-ai','autoscaling','aws-transfer-family','backup','batch','braket','cdk','certificate-manager','chatbot','chime','cloud9','cloudformation','cloudfront','cloudhsm','cloudsearch','cloudshell','cloudtrail','cloudwatch','codebuild','codecommit','codedeploy','codeguru','codepipeline','codestar','cognito','comprehend','compute-optimizer','config','connect','console','consolemobile','containerscopilot','corretto','datapipeline','datasync','deepcomposer','deeplens','deepracer','detective','device-farm','devops-guru','directconnect','directoryservice','dms','documentdb','dynamodb','ebs','ec2','ec2autoscaling','ecr','ecs','efs','eks','ekseks-anywhere','ekseks-distro','elasticache','elasticbeanstalk','elasticloadbalancing','elasticmapreduce','elasticsearch-service','elastictranscoder','eventbridge','fargate','fis','forecast','fraud-detector','freertos','fsxlustre','fsxwindows','gamelift','global-accelerator','glue','grafana','ground-station','guardduty','iam','iot-analytics','iot-core','iot-device-defender','iot-device-management','iot-events','iot-sitewise','iot-things-graph','kendra','keyspaces','kinesis','kinesisvideo-streams','kms','lake-formation','lambda','lex','license-manager','lightsail','location','lookout-for-equipment','lookout-for-metrics','lookout-for-vision','lumberyard','machine-learningcontainers','macie','managed-blockchain','managed-workflows-for-apache-airflow','migration-evaluator','migration-hub','monitron','msk','neptune','network-firewall','opsworks','organizations','otel','outposts','panorama','personalize','pinpoint','polly','privatelink','prometheus','proton','qldb','quicksight','ram','rds','rdsaurora','rdsvmware','redshift','rekognition','robomaker','route53','s3','sagemaker','sagemakergroundtruth','security-hub','server-migration-service','servicecatalog','ses','shield','snow','sns','sqs','step-functions','storagegateway','sumerian','systems-manager','textract','timestream','transcribe','transit-gateway','translate','vpc','well-architected-tool','workdocs','worklink','workmail','workspaces','xray'];
                callback([].concat(utils, products));
            },
            keydown: function(e) {
                if (animation) {
                    // Disable keyboard when animating
                    return false;
                }

                if (mode === 'wait_for_key') {
                    mode = 'playing'
                    start(this, spinner);
                    playJeopardy(this, state_products, stop);
                    return false;
                }
            }
        });

    });
});
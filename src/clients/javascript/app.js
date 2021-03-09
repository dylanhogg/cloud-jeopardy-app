function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function handleAnswer(term, answer, correct_answer) {
    if (correct_answer === null) {
        term.echo('Game has not started.');
    } else if (answer === correct_answer) {
        state_correct++;
        term.echo('Correct!');
        term.echo('Score: ' + state_correct + "/" + state_total);
        // TODO: add correct streak
    } else {
        state_incorrect++;
        term.echo('Wrong :(');
        term.echo('Score: ' + state_correct + "/" + state_total);
    }
}

var qna_data = null;
var qna_data_count = 0;
var data_ready = false;
var product_name = null;
var config_spinner_name = 'dots';
var correct_answer = null;

var state_correct = 0;
var state_incorrect = 0;
var state_total = 0;

$(function($, undefined) {
    var spinners_url = 'spinners.json';
    $.getJSON(spinners_url, function(spinners) {
        var animation = false;
        var timer;
        var prompt;
        var spinner;
        var i;

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

        function stop(term, spinner) {
            setTimeout(function() {
                clearInterval(timer);
                term.set_prompt(prompt);
                animation = false;
                term.find('.cursor').show();
            }, 0);
        }

        $('body').terminal({
            help: function() {
                this.echo('Try typing "play ec2", or "play ec" and then hitting tab twice to autocomplete.');
            },
            a: function() {
                handleAnswer(this, 1, correct_answer)
            },
            A: function() {
                handleAnswer(this, 1, correct_answer)
            },
            b: function() {
                handleAnswer(this, 2, correct_answer)
            },
            B: function() {
                handleAnswer(this, 2, correct_answer)
            },
            c: function() {
                handleAnswer(this, 3, correct_answer)
            },
            C: function() {
                handleAnswer(this, 3, correct_answer)
            },
            play: function(product) {
                spinner = spinners[config_spinner_name];
                start(this, spinner);

                data_ready = false;
                data_url = "https://prd-s3-cloud-jeopardy-api.s3.amazonaws.com/faqs/" + product + "-faq.json";

                $.ajax({
                  type: "GET",
                  url: data_url,
                  cache: false,
                  success: function(data) {
                    var term = $.terminal.active()
                    stop(term, spinner);

                    qna_data = data;
                    qna_data_count = Object.keys(qna_data).length;
                    data_ready = true;
                    product_name = product;

                    var idx1 = randomNumber(0, qna_data_count);
                    var idx2 = randomNumber(0, qna_data_count);
                    var idx3 = randomNumber(0, qna_data_count);

                    term.echo("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃ Answer                         ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n"
                            + data[idx1]["answer"]);
                    term.echo("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃ Question A                     ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n"
                            + data[idx1]["question"]);
                    term.echo("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃ Question B                     ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n"
                            + data[idx2]["question"]);
                    term.echo("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃ Question C                     ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n"
                            + data[idx3]["question"]);
                    term.echo("");

                    correct_answer = 1;
                    state_total++;
                  },
                  error: function(data) {
                    console.log('ajax error');
                    console.log(data);
                    var term = $.terminal.active()
                    stop(term, spinner);
                    term.echo("ajax error: " + data.status + " " + data.statusText + " for url: " + data_url);
                  },
                });
            }
        }, {
            name: 'cloud_jeopardy',
            prompt: 'cloud-jeopardy> ',
            greetings: 'Welcome to Cloud Jeopardy!\n\n' +
                'An AWS Certification study tool - select the correct question for the given AWS FAQ answer, Jeopardy style.\n',
            scrollOnEcho: true,
            completion: function(command, callback) {
                var utils = ['help', 'status', 'play'];
                var products = ['amazon-mq','amplify','api-gateway','app-mesh','app2container','appflow','application-discovery','appstream2','appsync','athena','audit-manager','augmented-ai','autoscaling','aws-transfer-family','backup','batch','braket','cdk','certificate-manager','chatbot','chime','cloud9','cloudformation','cloudfront','cloudhsm','cloudsearch','cloudshell','cloudtrail','cloudwatch','codebuild','codecommit','codedeploy','codeguru','codepipeline','codestar','cognito','comprehend','compute-optimizer','config','connect','console','consolemobile','containerscopilot','corretto','datapipeline','datasync','deepcomposer','deeplens','deepracer','detective','device-farm','devops-guru','directconnect','directoryservice','dms','documentdb','dynamodb','ebs','ec2','ec2autoscaling','ecr','ecs','efs','eks','ekseks-anywhere','ekseks-distro','elasticache','elasticbeanstalk','elasticloadbalancing','elasticmapreduce','elasticsearch-service','elastictranscoder','eventbridge','fargate','fis','forecast','fraud-detector','freertos','fsxlustre','fsxwindows','gamelift','global-accelerator','glue','grafana','ground-station','guardduty','iam','iot-analytics','iot-core','iot-device-defender','iot-device-management','iot-events','iot-sitewise','iot-things-graph','kendra','keyspaces','kinesis','kinesisvideo-streams','kms','lake-formation','lambda','lex','license-manager','lightsail','location','lookout-for-equipment','lookout-for-metrics','lookout-for-vision','lumberyard','machine-learningcontainers','macie','managed-blockchain','managed-workflows-for-apache-airflow','migration-evaluator','migration-hub','monitron','msk','neptune','network-firewall','opsworks','organizations','otel','outposts','panorama','personalize','pinpoint','polly','privatelink','prometheus','proton','qldb','quicksight','ram','rds','rdsaurora','rdsvmware','redshift','rekognition','robomaker','route53','s3','sagemaker','sagemakergroundtruth','security-hub','server-migration-service','servicecatalog','ses','shield','snow','sns','sqs','step-functions','storagegateway','sumerian','systems-manager','textract','timestream','transcribe','transit-gateway','translate','vpc','well-architected-tool','workdocs','worklink','workmail','workspaces','xray'];
                callback([].concat(utils, products));
            }
        });
    });
});
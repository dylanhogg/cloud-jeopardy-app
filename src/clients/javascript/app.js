function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

var qna_data = null;
var qna_data_count = 0;
var data_ready = false;
var product_name = null;
var config_spinner_name = 'dots';
var correct_answer = null;


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
                this.echo('Try typing "qn ec2", or "qn ec" and then hitting tab twice to autocomplete.');
            },
            a: function() {
                if (correct_answer == 1) {
                    this.echo('Correct!!');
                } else {
                    this.echo('Wrong :(');
                }
            },
            b: function() {
                if (correct_answer == 2) {
                    this.echo('Correct!!');
                } else {
                    this.echo('Wrong :(');
                }
            },
            c: function() {
                if (correct_answer == 3) {
                    this.echo('Correct!!');
                } else {
                    this.echo('Wrong :(');
                }
            },
            qn: function(product) {
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

                    term.echo("\nAnswer:");
                    term.echo(data[idx1]["answer"]);
                    term.echo("\nQuestion A:");
                    term.echo(data[idx1]["question"]);
                    term.echo("\nQuestion B:");
                    term.echo(data[idx2]["question"]);
                    term.echo("\nQuestion C:");
                    term.echo(data[idx3]["question"]);
                    term.echo("\n");

                    correct_answer = 1;
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
            greetings: 'Welcome to Cloud Jeopardy!\n\nAn AWS Certification study tool - select the correct question for the given AWS FAQ answer, Jeopardy style.\n',
            scrollOnEcho: true,
            completion: function(command, callback) {
                var utils = ['help', 'status', 'qn'];
                var products = ['amazon-mq','amplify','api-gateway','app-mesh','app2container','appflow','application-discovery','appstream2','appsync','athena','audit-manager','augmented-ai','autoscaling','aws-transfer-family','backup','batch','braket','cdk','certificate-manager','chatbot','chime','cloud9','cloudformation','cloudfront','cloudhsm','cloudsearch','cloudshell','cloudtrail','cloudwatch','codebuild','codecommit','codedeploy','codeguru','codepipeline','codestar','cognito','comprehend','compute-optimizer','config','connect','console','consolemobile','containerscopilot','corretto','datapipeline','datasync','deepcomposer','deeplens','deepracer','detective','device-farm','devops-guru','directconnect','directoryservice','dms','documentdb','dynamodb','ebs','ec2','ec2autoscaling','ecr','ecs','efs','eks','ekseks-anywhere','ekseks-distro','elasticache','elasticbeanstalk','elasticloadbalancing','elasticmapreduce','elasticsearch-service','elastictranscoder','eventbridge','fargate','fis','forecast','fraud-detector','freertos','fsxlustre','fsxwindows','gamelift','global-accelerator','glue','grafana','ground-station','guardduty','iam','iot-analytics','iot-core','iot-device-defender','iot-device-management','iot-events','iot-sitewise','iot-things-graph','kendra','keyspaces','kinesis','kinesisvideo-streams','kms','lake-formation','lambda','lex','license-manager','lightsail','location','lookout-for-equipment','lookout-for-metrics','lookout-for-vision','lumberyard','machine-learningcontainers','macie','managed-blockchain','managed-workflows-for-apache-airflow','migration-evaluator','migration-hub','monitron','msk','neptune','network-firewall','opsworks','organizations','otel','outposts','panorama','personalize','pinpoint','polly','privatelink','prometheus','proton','qldb','quicksight','ram','rds','rdsaurora','rdsvmware','redshift','rekognition','robomaker','route53','s3','sagemaker','sagemakergroundtruth','security-hub','server-migration-service','servicecatalog','ses','shield','snow','sns','sqs','step-functions','storagegateway','sumerian','systems-manager','textract','timestream','transcribe','transit-gateway','translate','vpc','well-architected-tool','workdocs','worklink','workmail','workspaces','xray'];
                callback([].concat(utils, products));
            }
        });
    });
});
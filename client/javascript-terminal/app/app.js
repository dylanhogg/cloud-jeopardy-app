var version = "v0.0.4";
var qna_data = null;
var qna_data_count = 0;
var data_ready = false;
var config_spinner_name = 'dots';
var config_prompt = 'A, B or C? > ';
var config_prompt_paused = '[press any key]';
var config_prompt_products = 'Select a product set to learn: ';

var correct_answer = null;
var correct_answer_display = null;
var state_product_name = null;
var state_product_href = null;
var state_products = null;

var state_product_sets = {
    "All products": ["athena", "cloudfront", "cloudwatch", "cognito", "dynamodb","ec2", "ecr", "ecs", "efs", "glue", "eks", "elasticache", "elasticmapreduce", "iam", "iot-core", "kinesis", "directconnect", "rds", "rdsaurora", "redshift", "route53", "lambda", "s3", "sagemaker", "sagemakergroundtruth", "sns", "sqs", "systems-manager", "vpc"],
    "Core only": ["cloudfront", "cloudwatch", "directconnect", "ec2", "efs", "iam", "lambda", "route53", "s3", "systems-manager", "vpc"],
    "Data only": ["athena", "dynamodb", "eks", "glue", "elasticache", "elasticmapreduce", "kinesis", "rds", "rdsaurora", "redshift", "s3"],
    "Machine Learning only": ["sagemaker", "sagemakergroundtruth", "elasticmapreduce"]
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

//    if (product === null || product.strip() === '') {
//        term.echo('product cannot be empty.');
//        stopSpinningFn(term, 'playing');
//        return;
//    }

    $.ajax({
      type: "GET",
      url: data_url,
      cache: false,
      success: function(data) {
        stopSpinningFn(term, 'playing');

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
        stopSpinningFn(term, 'playing');  // TOOD: maybe next mode should be wait_for_key?
        term.echo("Sorry, my bad :( Ajax error: " + data.status + " " + data.statusText + " for url: " + data_url);
      },
    });
}

$(function($, undefined) {
    var spinners_url = 'spinners.json';
    $.getJSON(spinners_url, function(spinners) {
        var timer;
        var prompt;
        var i;
        var spinner = spinners[config_spinner_name];
        var mode = 'select_products';  // {select_products, wait_for_key, playing, animation}

        function start(term, spinner) {
            mode = 'animation';
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

        function stop(term, next_mode) {
            setTimeout(function() {
                clearInterval(timer);
                term.set_prompt(config_prompt);
                mode = next_mode;
                term.find('.cursor').show();
            }, 0);
        }

        var greeting = 'Welcome to Cloud Jeopardy!\n\n' +
                       'An AWS Certification study tool - select the correct question for the given AWS FAQ answer, Jeopardy style.\n\n' +
                       'Source available here: https://github.com/dylanhogg/cloud-jeopardy-app\n\n';

        greeting += 'Which product set to play?\n';
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
                if (mode == 'playing') {
                    handleAnswer(this, 0, correct_answer);
                    mode = 'wait_for_key';
                }
                else if (mode == 'select_products') {
                    // TODO: refactor the select_products handlers and make nicer UI...
                    state_products = state_product_sets[Object.keys(state_product_sets)[0]];
                    this.echo("\nGood choice. This game will test you on these AWS products:\n\n" + state_products.join(", ") + "\n");
                    start(this, spinner);
                    playJeopardy(this, state_products, stop);
                }
            }
            else if (cmd == 'b' || cmd == '2') {
                if (mode == 'playing') {
                    handleAnswer(this, 1, correct_answer);
                    mode = 'wait_for_key';
                }
                else if (mode == 'select_products') {
                    state_products = state_product_sets[Object.keys(state_product_sets)[1]];
                    this.echo("\nGood choice. This game will test you on these AWS products:\n\n" + state_products.join(", ") + "\n");
                    start(this, spinner);
                    playJeopardy(this, state_products, stop);
                }
            }
            else if (cmd == 'c' || cmd == '3') {
                if (mode == 'playing') {
                    handleAnswer(this, 2, correct_answer);
                    mode = 'wait_for_key';
                }
                else if (mode == 'select_products') {
                    state_products = state_product_sets[Object.keys(state_product_sets)[2]];
                    this.echo("\nGood choice. This game will test you on these AWS products:\n\n" + state_products.join(", ") + "\n");
                    start(this, spinner);
                    playJeopardy(this, state_products, stop);
                }
            }
            else if (mode == 'select_products' && (cmd == 'd' || cmd == '4')) {
                state_products = state_product_sets[Object.keys(state_product_sets)[3]];
                this.echo("\nGood choice. This game will test you on these AWS products:\n\n" + state_products.join(", ") + "\n");
                start(this, spinner);
                playJeopardy(this, state_products, stop);
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
            else if (cmd == 'products') {
                this.echo('Products in play: ' + state_products);
            }
            else if (cmd == 'help') {
                this.echo('  play <product> - Only show <product> questions; Try "play ec" and then hit tab twice for autocomplete.');
                this.echo('  about - About this app.');
                this.echo('  help - This message.');
            }
            else if (cmd == 'about' || cmd == 'credits') {
                this.echo('Cloud Jeopardy ' + version);
                this.echo('\nFor source code and all about this app see: https://github.com/dylanhogg/cloud-jeopardy-app\n');
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
                // Auto complete commands
                var utils = ['help', 'play', 'about'];
                var all_products = state_product_sets[Object.keys(state_product_sets)[0]];
                callback([].concat(utils, all_products));
            },
            keydown: function(e) {
                if (mode === 'animation') {
                    // Disable keyboard when animating
                    // The stop callback fn updates mode once loading complete
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
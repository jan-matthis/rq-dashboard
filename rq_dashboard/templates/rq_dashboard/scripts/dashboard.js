var url_for = function(name, param) {
    var url = {{ rq_url_prefix|tojson|safe }};
    if (name == 'rq-instances') {url += 'data/rq-instances.json'; }
    else if (name == 'rq-instance') { url += 'rq-instance/' + encodeURIComponent(param); }
    else if (name == 'queues') { url += 'data/queues.json'; }
    else if (name == 'workers') { url += 'data/workers.json'; }
    else if (name == 'cancel_job') { url += 'job/' + encodeURIComponent(param) + '/cancel'; }
    else if (name == 'requeue_job') { url += 'job/' + encodeURIComponent(param) + '/requeue'; }
    return url;
};

//Show full string in title if string too long
document.querySelectorAll('.ellipsify').forEach(function (elem) {
    if (parseFloat(window.getComputedStyle(elem).width) === parseFloat(window.getComputedStyle(elem.parentElement).width)) {
      elem.setAttribute('title', elem.textContent);
    }
});

var url_for_jobs_data = function(queue_name, registry_name, per_page, page) {
    var url = '/data' + {{ rq_url_prefix|tojson|safe }} + 'jobs/' + encodeURIComponent(queue_name) + '/' + encodeURIComponent(registry_name) + '/' + encodeURIComponent(per_page) + '/' + encodeURIComponent(page) + '.json';
    return url;
};

var url_for_jobs_view = function(queue_name, registry_name, per_page, page) {
    var url = '/view' + {{ rq_url_prefix|tojson|safe }} + 'jobs/' + encodeURIComponent(queue_name) + '/' + encodeURIComponent(registry_name) + '/' + encodeURIComponent(per_page) + '/' + encodeURIComponent(page);
    return url;
};

var url_for_single_job_data = function(job_id) {
    var url = '/data/job' + {{ rq_url_prefix|tojson|safe }} + encodeURIComponent(job_id) + '.json';
    return url;
}

var url_for_single_job_view = function(job_id) {
    var url = '/view/job' + {{ rq_url_prefix|tojson|safe }} + encodeURIComponent(job_id);
    return url;
}

var toRelative = function(universal_date_string) {
    var tzo = new Date().getTimezoneOffset();
    var d = Date.create(universal_date_string).rewind({ minutes: tzo });
    return d.relative();
};

var toShort = function(universal_date_string) {
    var tzo = new Date().getTimezoneOffset();
    var d = Date.create(universal_date_string).rewind({ minutes: tzo });
    return d.format()
}

var api = {
    getRqInstances: function(cb) {
        $.getJSON(url_for('rq-instances'), function(data) {
            var instances = data.rq_instances;
            cb(instances);
        }).fail(function(err){
            cb(null, err || true);
        });
    },

    getQueues: function(cb) {
        $.getJSON(url_for('queues'), function(data) {
            var queues = data.queues;
            cb(queues);
        }).fail(function(err){
            cb(null, err || true);
        });
    },

    getJobs: function(queue_name, registry_name, per_page, page, cb) {
        $.getJSON(url_for_jobs_data(queue_name, registry_name, per_page, page), function(data) {
            var jobs = data.jobs;
            var pagination = data.pagination;
            cb(jobs, pagination);
        }).fail(function(err){
            cb(null, null, err || true);
        });
    },

    getJob: function(job_id, cb) {
        $.getJSON(url_for_single_job_data(job_id), function(data) {
            var job = data;
            cb(job);
        }).fail(function(err){
            cb(null, err || true);
        });
    },

    getWorkers: function(cb) {
        $.getJSON(url_for('workers'), function(data) {
            var workers = data.workers;
            cb(workers);
        }).fail(function(err){
            cb(null, err || true);
        });
    }
};

//
// Modal confirmation
//
var modalConfirm = function(action, cb) {
    $('#confirmation-modal').modal('show');
    $('#confirmation-modal-action').text(action);

    $('#confirmation-modal-yes').unbind().click(function () {
        cb();
        $('#confirmation-modal').modal('hide');
    });

    $('#confirmation-modal-no').unbind().click(function () {
        $('#confirmation-modal').modal('hide');
    });
};

//
// RQ instances
//
(function($) {
    var rqInstancesRow = $('#rq-instances-row');
    var $rqInstances = $('#rq-instances');

    api.getRqInstances(function(instances, err) {
        // Return immediately in case of error
        if (err) {
            return;
        }
        
        $.each(instances, function(i, instance) {
            $rqInstances.append($('<option>', {
                value: i,
                text: instance
            }));
        });
    });

    // Listen for changes on the select
    $rqInstances.change(function() {
        var url = url_for('rq-instance', $(this).val());
        $.post(url, function(data) {});
    });
})($);

(function ($) {
    $('#autorefresh-switch').change(function() {
        if ($('#autorefresh-switch').prop('checked')){
            AUTOREFRESH_FLAG = 1;
        } else {
            AUTOREFRESH_FLAG = 0;
        }
    });
})($);

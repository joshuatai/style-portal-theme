/*
 * Dashboard UI Library: exists.js v0.0.1
 * Copyright 2015-2015 Trend Micro
 * Licensed under the MIT license
 */
+(function ($) {
  'use strict';

  $.fn.exists = function () {
    return this.length > 0 ? this : false;
  };
})(jQuery);
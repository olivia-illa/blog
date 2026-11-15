require "date"

module Jekyll
  class PostCalendar < Generator
    safe true
    priority :low

    def generate(site)
      template = site.pages.find { |page| page.path == "dates.html" }
      return unless template

      months = site.posts.docs.group_by { |post| post.date.getlocal("+08:00").strftime("%Y-%m") }
      keys = months.keys.sort
      return if keys.empty?

      source = template.content.dup
      base_data = template.data.dup
      base_data["calendar_months"] = keys.reverse.map do |key|
        first = Date.strptime("#{key}-01", "%Y-%m-%d")
        { "name" => first.strftime("%B"), "year" => first.year, "url" => "/dates/#{key}/", "post_count" => months[key].size,
          "last_date" => first.next_month.prev_day.strftime("%b %d %Y") }
      end
      template.data["calendar_months"] = base_data["calendar_months"]
      template.data["calendar_index"] = true
      keys.each_with_index do |key, index|
        first = Date.strptime("#{key}-01", "%Y-%m-%d")
        days = Date.new(first.year, first.month, -1).day
        data = {
          "title" => "Dates — #{first.strftime('%B %Y')}",
          "calendar_month" => key,
          "calendar_name" => first.strftime("%B"),
          "calendar_year" => first.strftime("’%y"),
          "calendar_days" => days,
          "calendar_offset" => first.wday,
          "calendar_weeks" => (first.wday + days + 6) / 7,
          "calendar_posts" => months[key].sort_by { |post| [post.date, post.relative_path] },
          "calendar_previous" => index.positive? ? "/dates/#{keys[index - 1]}/" : nil,
          "calendar_next" => keys[index + 1] ? "/dates/#{keys[index + 1]}/" : nil
        }
        page = PageWithoutAFile.new(site, site.source, "dates/#{key}", "index.html")
        page.content = source
        page.data = base_data.merge(data).merge("permalink" => "/dates/#{key}/", "calendar_index" => false)
        site.pages << page
        template.data.merge!(data) if key == keys.last
      end
    end
  end
end

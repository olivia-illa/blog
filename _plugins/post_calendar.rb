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
        page.data = base_data.merge(data).merge("permalink" => "/dates/#{key}/")
        site.pages << page
        template.data.merge!(data) if key == keys.last
      end
    end
  end
end
